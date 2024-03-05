import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import topicFixtures from "discourse/tests/fixtures/topic";
import {
  acceptance,
  query,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import selectKit from "discourse/tests/helpers/select-kit-helper";
import { cloneJSON } from "discourse-common/lib/object";
import I18n from "I18n";
import NotificationFixture from "../fixtures/notifications-fixtures";

function assignCurrentUserToTopic(needs) {
  needs.pretender((server, helper) => {
    server.get("/t/44.json", () => {
      const topic = cloneJSON(topicFixtures["/t/28830/1.json"]);
      console.log("topic", topic);
      // topic["assigned_to_user"] = {
      //   username: "eviltrout",
      //   name: "Robin Ward",
      //   avatar_template:
      //     "/letter_avatar/eviltrout/{size}/3_f9720745f5ce6dfc2b5641fca999d934.png",
      // };
      // topic["assignment_note"] = "Shark Doododooo";
      // topic["assignment_status"] = "New";
      // topic["indirectly_assigned_to"] = {
      //   2: {
      //     assigned_to: {
      //       name: "Developers",
      //     },
      //     post_number: 2,
      //     assignment_note: '<script>alert("xss")</script>',
      //   },
      // };
      topic.post_stream.posts[1]["assigned_to_user"] = {
          username: "eviltrout",
          name: "Robin Ward",
          avatar_template:
            "/letter_avatar/eviltrout/{size}/3_f9720745f5ce6dfc2b5641fca999d934.png",
      };

      return helper.response(topic);
    });
  });
}

acceptance("Discourse Assign | Ellipsis menu on assigned posts", function (needs) {
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
});
