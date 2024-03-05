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
  secondPost["assigned_to_user"] = {username};

  return topic;
}

const popupMenuTrigger = ".post-stream .topic-post .more-button";
const popupMenu = {
  unassign: ".popup-menu .popup-menu-btn svg.d-icon-user-plus",
  editAssignment: ".popup-menu .popup-menu-btn svg.d-icon-group-plus"
};


acceptance(
  "Discourse Assign | Popup menu on assigned posts",
  function (needs) {
    needs.user();
    needs.settings({
      assign_enabled: true,
      tagging_enabled: true,
      assigns_user_url_path: "/",
      assigns_public: true,
      enable_assign_status: true,
    });

    needs.pretender((server, helper) => {
      server.get("/t/44.json", () => {
        return helper.response(topicWithAssignedPostResponse());
      });

      server.put("/assign/unassign", (request) => {
        return helper.response({ success: true });
      });
    });

    needs.hooks.beforeEach(() => {
      updateCurrentUser({ can_assign: true });
    });

    test("Unassigns the post", async function (assert) {
      await visit("/t/assignment-topic/44");
      await click(popupMenuTrigger);
      await click(popupMenu.unassign);
      // todo assert post is not assigned anymore
    });

    test("Reassigns the post", async function (assert) {
      await visit("/t/assignment-topic/44");
      await click(popupMenuTrigger);
      await click(popupMenu.editAssignment);

      // todo click Unassign
      // todo assert post is not assigned anymore
    });
  }
);
