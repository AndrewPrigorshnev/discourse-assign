import { click, fillIn, pauseTest, visit } from "@ember/test-helpers";
import { test } from "qunit";
import topicFixtures from "discourse/tests/fixtures/topic";
import {
  acceptance,
  publishToMessageBus,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import { cloneJSON } from "discourse-common/lib/object";

const username = "eviltrout";
const new_assignee_username = "new_assignee";

function topicWithAssignedPostResponse() {
  const topic = cloneJSON(topicFixtures["/t/28830/1.json"]);
  const secondPost = topic.post_stream.posts[1];

  topic["indirectly_assigned_to"] = {
    [secondPost.id]: {
      assigned_to: {
        username,
      },
      post_number: 1,
    },
  };
  secondPost["assigned_to_user"] = { username };

  return topic;
}

const selectors = {
  assignedTo: ".post-stream article#post_2 .assigned-to",
  moreButton: ".post-stream .topic-post .more-button",
  popupMenu: {
    unassign: ".popup-menu .popup-menu-btn svg.d-icon-user-plus",
    editAssignment: ".popup-menu .popup-menu-btn svg.d-icon-group-plus",
  },
  modal: {
    assignee: ".modal-container .select-kit-header-wrapper",
    assigneeInput: ".modal-container .filter-input",
    assignButton: ".d-modal__footer .btn-primary",
  },
};

const topic = topicWithAssignedPostResponse();
const post = topic.post_stream.posts[1];

acceptance("Discourse Assign | Topic level assign menu", function (needs) {
  needs.user();
  needs.settings({
    assign_enabled: true,
  });

  needs.pretender((server, helper) => {
    server.get("/t/44.json", () => helper.response(topic));

    server.put("/assign/assign", () => {
      return helper.response({ success: true });
    });

    server.put("/assign/unassign", () => {
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

  test("Unassigns the post", async function (assert) {
    await visit("/t/assignment-topic/44");
    await pauseTest();

    await click("#topic-footer-dropdown-reassign");

    debugger;

    await click(selectors.popupMenu.unassign);
    await publishToMessageBus("/staff/topic-assignment", {
      type: "unassigned",
      topic_id: topic.id,
      post_id: post.id,
      assigned_type: "User",
    });

    assert.dom(".popup-menu").doesNotExist("The popup menu is closed");
    assert.dom(selectors.assignedTo).doesNotExist("The post is unassigned");
  });
});
