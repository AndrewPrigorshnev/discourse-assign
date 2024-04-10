import { getOwner } from "@ember/application";
import { click, fillIn, settled, visit } from "@ember/test-helpers";
import { test } from "qunit";
import {
  acceptance,
  query,
  queryAll,
  publishToMessageBus,
} from "discourse/tests/helpers/qunit-helpers";
import topicWithAssignedPost from "../fixtures/topic-with-assigned-post";

const topic = topicWithAssignedPost();
const new_assignee = "user_1";
const another_new_assignee = "user_2";

acceptance("Discourse Assign | Edit assignments modal", function (needs) {
  needs.user({ can_assign: true });
  needs.settings({
    assign_enabled: true,
  });

  needs.pretender((server, helper) => {
    server.get("/t/44.json", () => helper.response(topic));
    server.put("/assign/assign", () => {
      return helper.response({ success: true });
    });

    server.get("/assign/suggestions", () =>
      helper.response({
        assign_allowed_for_groups: [],
        suggestions: [{ username: new_assignee }],
      })
    );
    server.get("/u/search/users", () =>
      helper.response({ users: [{ username: new_assignee }] })
    );
  });

  // fixme andrei better test case name
  test("it lets reassign topic", async function (assert) {
    const appEvents = getOwner(this).lookup("service:app-events");

    await visit("/t/assignment-topic/44");
    await clickEditAssignmentsButton();

    await clickEditAssignmentsMenuItem();
    await setAssignee(new_assignee);
    await submitModal();
    await receiveMessageBusMessage(new_assignee, appEvents);

    assert
      .dom(".post-stream article#post_1 .assigned-to .assigned-to--user a")
      .hasText(
        new_assignee,
        "The topic is assigned to the new assignee"
      );
  });

  // fixme andrei better test case name
  test("it lets reassign posts", async function (assert) {
    await visit("/t/assignment-topic/44");
    await clickEditAssignmentsButton();
    await clickEditAssignmentsMenuItem();

    await selectPost(1);
    await setAssignee(new_assignee);

    // choose the second post
    await setAssignee(another_new_assignee);


    // check first post:     assignment
    // check second post:    assignment
  });

  async function clickEditAssignmentsButton() {
    await click("#topic-footer-dropdown-reassign .btn");
  }

  async function clickEditAssignmentsMenuItem() {
    await click(`li[data-value='reassign']`);
  }

  async function receiveMessageBusMessage(newAssignee, appEvents) {
    await publishToMessageBus("/staff/topic-assignment", {
      type: "assigned",
      topic_id: topic.id,
      post_id: false,
      assigned_type: "User",
      assigned_to: {
        username: newAssignee,
      },
    });
    // fixme andrei get rid of this:
    appEvents.trigger("post-stream:refresh", {id: topic.post_stream.posts[0].id});
    await settled();
  }

  async function selectPost(number) {
    await click(".target .single-select .select-kit-header-wrapper");
    await click(`li[title='Post #${number}']`);
  }

  async function setAssignee(username) {
    await click(
      ".modal-container #assignee-chooser-header .select-kit-header-wrapper"
    );
    // fixme andrei get rid of the second click:
    await click(
      ".modal-container #assignee-chooser-header .select-kit-header-wrapper"
    );
    await fillIn(".modal-container .filter-input", username);
    await click(".email-group-user-chooser-row");
  }

  async function submitModal() {
    await click(".d-modal__footer .btn-primary");
  }
});
