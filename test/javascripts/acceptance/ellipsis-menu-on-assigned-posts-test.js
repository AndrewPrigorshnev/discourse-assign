import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import topicFixtures from "discourse/tests/fixtures/topic";
import {
  acceptance,
  query,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import { cloneJSON } from "discourse-common/lib/object";

function topicWithAssignedPostResponse() {
  const username = "eviltrout";
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

const ellipsisButton = ".post-stream .topic-post .more-button";
const popupMenu = {
  unassign: ".popup-menu .popup-menu-btn svg.d-icon-user-plus",
  editAssignment: ".popup-menu .popup-menu-btn svg.d-icon-group-plus",
};

acceptance("Discourse Assign | Popup menu on assigned posts", function (needs) {
  needs.user();
  needs.settings({
    assign_enabled: true,
    tagging_enabled: true,
    assigns_user_url_path: "/",
    assigns_public: true,
    enable_assign_status: true,
  });

  needs.pretender((server, helper) => {
    server.get("/t/44.json", () =>
      helper.response(topicWithAssignedPostResponse())
    );

    server.put("/assign/unassign", () => {
      console.log("/assign/unassign has been called");
      return helper.response({ success: true });
    });
  });

  needs.hooks.beforeEach(() => {
    updateCurrentUser({ can_assign: true });
  });

  test("Unassigns the post", async function (assert) {
    await visit("/t/assignment-topic/44");
    await click(ellipsisButton);
    await click(popupMenu.unassign);
    assert
      .dom(".post-stream .topic-post .assigned-to")
      .exists();
  });

  test("Reassigns the post", async function (assert) {
    await visit("/t/assignment-topic/44");
    await click(ellipsisButton);
    await click(popupMenu.editAssignment);
    // todo assert post is not assigned anymore
  });
});
