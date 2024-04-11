import { getOwner } from "@ember/application";
import { click, fillIn, settled, visit } from "@ember/test-helpers";
import { test } from "qunit";
import {
  acceptance,
  query,
  queryAll,
  publishToMessageBus,
} from "discourse/tests/helpers/qunit-helpers";
import topicWithAssignedPosts from "../fixtures/topic-with-assigned-posts";

const topic = topicWithAssignedPosts();
const firstReply = topic.post_stream.posts[1];
const secondReply = topic.post_stream.posts[2];
const new_assignee_1 = "user_1";
const new_assignee_2 = "user_2";

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

    const suggestions = [
      { username: new_assignee_1 },
      { username: new_assignee_2 },
    ];
    server.get("/assign/suggestions", () =>
      helper.response({
        assign_allowed_for_groups: [],
        suggestions,
      })
    );
    server.get("/u/search/users", () =>
      helper.response({
        users: suggestions,
      })
    );
  });

  test("reassigning topic and posts in one go", async function (assert) {
    const appEvents = getOwner(this).lookup("service:app-events");

    await visit("/t/assignment-topic/44");
    await openModal();
    await selectAssignee(new_assignee_1);

    await selectPost(1);
    await expandAssigneeChooser();
    await selectAssignee(new_assignee_2);

    await selectPost(2);
    await expandAssigneeChooser();
    await selectAssignee(new_assignee_2);

    await submitModal();
    await receiveTopicAssignedMessage(new_assignee_1, appEvents);
    await receivePostAssignedMessage(firstReply, new_assignee_2, appEvents);
    await receivePostAssignedMessage(secondReply, new_assignee_2, appEvents);

    assert
      .dom(".post-stream article#post_1 .assigned-to .assigned-to--user a")
      .hasText(new_assignee_1, "The topic is assigned to a new assignee");

    assert
      .dom(".post-stream article#post_2 .assigned-to .assigned-to-username")
      .hasText(new_assignee_2, "The first reply is assigned to a new assignee");

    assert
      .dom(".post-stream article#post_3 .assigned-to .assigned-to-username")
      .hasText(new_assignee_2, "The second reply is assigned to a new assignee");
  });

  async function expandAssigneeChooser() {
    await click(".modal-container #assignee-chooser-header .select-kit-header-wrapper"); // fixme andrei
  }

  async function openModal() {
    await click("#topic-footer-dropdown-reassign .btn");
    await click(`li[data-value='reassign']`);
  }

  async function receiveTopicAssignedMessage(newAssignee, appEvents) {
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
    appEvents.trigger("post-stream:refresh", {
      id: topic.post_stream.posts[0].id,
    });
    await settled();
  }

  async function receivePostAssignedMessage(post, newAssignee, appEvents) {
    await publishToMessageBus("/staff/topic-assignment", {
      type: "assigned",
      topic_id: topic.id,
      post_id: post.id,
      assigned_type: "User",
      assigned_to: {
        username: newAssignee,
      },
    });
    // fixme andrei get rid of this:
    appEvents.trigger("post-stream:refresh", {
      id: post.id,
    });
    await settled();
  }

  async function selectPost(number) {
    await click(".target .single-select .select-kit-header-wrapper");
    await click(`li[title='Post #${number}']`);
  }

  async function selectAssignee(username) {
    await click(`.email-group-user-chooser-row[data-value='${username}']`);
  }

  async function submitModal() {
    await click(".d-modal__footer .btn-primary");
  }
});
