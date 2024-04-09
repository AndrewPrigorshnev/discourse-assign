import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import {
  acceptance,
  publishToMessageBus,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import topicWithAssignedPost from "../fixtures/topic-with-assigned-post";

const topic = topicWithAssignedPost();
const post = topic.post_stream.posts[1];

acceptance("Discourse Assign | Edit assignments modal", function (needs) {
  needs.user();
  needs.settings({
    assign_enabled: true,
  });

  needs.pretender((server, helper) => {
    server.get("/t/44.json", () => helper.response(topic));
    server.put("/assign/unassign", () => {
      return helper.response({ success: true });
    });

    server.get("/assign/suggestions", () =>
      helper.response({
        assign_allowed_for_groups: [],
        suggestions: [/*{ username: new_assignee_username }*/], // fixme andrei
      })
    );
  });

  needs.hooks.beforeEach(() => {
    updateCurrentUser({ can_assign: true });
  });

  // fixme andrei better test case name
  test("it lets reassign topic", async function (assert) {
    await visit("/t/assignment-topic/44");
    await click("#topic-footer-dropdown-reassign .btn");

    await click(`li[data-value='reassign']`);
    // await pauseTest();
    // set new assignee
    // set assignment comment

    // check topic assignment
    assert.ok(true);
  });

  // fixme andrei better test case name
  test("it lets reassign posts", async function (assert) {
    await visit("/t/assignment-topic/44");
    await click("#topic-footer-dropdown-reassign .btn");
    await click(`li[data-value='reassign']`);

    // choose the first post
    // set new assignee
    // set assignment comment

    // choose yje second post
    // set new assignee
    // set assignment comment

    // check first post assignment
    // check second post assignment
    assert.ok(true);
  });
});
