import { getOwner } from "@ember/application";
import { click, fillIn, visit } from "@ember/test-helpers";
import { test } from "qunit";
import {
  acceptance,
  publishToMessageBus,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import topicWithAssignedPost from "../fixtures/topic-with-assigned-post";

const topic = topicWithAssignedPost();
const new_assignee_username = "new_assignee";

acceptance("Discourse Assign | Edit assignments modal", function (needs) {
  needs.user();
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
        suggestions: [{ username: new_assignee_username }],
      })
    );
    server.get("/u/search/users", () =>
      helper.response({ users: [{ username: new_assignee_username }] })
    );
  });

  needs.hooks.beforeEach(() => {
    updateCurrentUser({ can_assign: true });
  });

  // fixme andrei better test case name
  test("it lets reassign topic", async function (assert) {
    const appEvents = getOwner(this).lookup("service:app-events");
    const note = "reassigning to another user";

    await visit("/t/assignment-topic/44");
    await clickEditAssignmentsButton();

    await clickEditAssignmentsMenuItem();
    await setAssignee(new_assignee_username);
    await submitModal();
    await receiveMessageBusMessage(new_assignee_username, appEvents);

    await pauseTest();
    // check topic assignment
  });

  // fixme andrei better test case name
  test("it lets reassign posts", async function (assert) {
    await visit("/t/assignment-topic/44");
    await clickEditAssignmentsButton();
    await clickEditAssignmentsMenuItem();

    // choose the first post
    // set new assignee
    // set assignment comment

    // choose the second post
    // set new assignee
    // set assignment comment

    // check first post:     assignment
    // check second post:    assignment
    assert.ok(true);
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
