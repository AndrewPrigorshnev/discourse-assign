import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import topicFixtures from "discourse/tests/fixtures/topic";
import {
  acceptance,
  query,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import { cloneJSON } from "discourse-common/lib/object";

function assignCurrentUserToTopic(needs) {
  needs.pretender((server, helper) => {
    server.get("/t/44.json", () => {
      const username = "eviltrout";

      const topic = cloneJSON(topicFixtures["/t/28830/1.json"]);
      const secondPost = topic.post_stream.posts[1];
      topic["indirectly_assigned_to"] = {
        118597: {
          assigned_to: {
            username,
          },
          post_number: 1,
        },
      };

      secondPost["assigned_to_user"] = {
        username,
        name: "Robin Ward",
        avatar_template:
          "/letter_avatar/eviltrout/{size}/3_f9720745f5ce6dfc2b5641fca999d934.png",
      };

      return helper.response(topic);
    });
  });
}

acceptance(
  "Discourse Assign | Ellipsis menu on assigned posts",
  function (needs) {
    needs.user();
    needs.settings({
      assign_enabled: true,
      tagging_enabled: true,
      assigns_user_url_path: "/",
      assigns_public: true,
      enable_assign_status: true,
    });

    assignCurrentUserToTopic(needs);

    test("Unassigns the post", async function (assert) {
      updateCurrentUser({ can_assign: true });
      await visit("/t/assignment-topic/44");
      console.log("breakpoint");
      await click(".more-button");
      // await click(".post-stream .topic-post .more-button");

      assert
        .dom("#topic-title .assigned-to")
        .hasText("eviltrout", "shows assignment in the header");
      assert
        .dom("#topic-footer-dropdown-reassign")
        .exists("shows reassign dropdown at the bottom of the topic");
    });

    test("Reassigns the post", async function (assert) {
      updateCurrentUser({ can_assign: true });
      await visit("/t/assignment-topic/44");

      assert
        .dom("#topic-title .assigned-to")
        .hasText("eviltrout", "shows assignment in the header");
      assert
        .dom("#topic-footer-dropdown-reassign")
        .exists("shows reassign dropdown at the bottom of the topic");
    });
  }
);
