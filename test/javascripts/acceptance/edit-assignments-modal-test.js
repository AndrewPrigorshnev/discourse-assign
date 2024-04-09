import { click, fillIn, visit } from "@ember/test-helpers";
import { test } from "qunit";
import {
  acceptance,
  publishToMessageBus,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import topicWithAssignedPost from "../fixtures/topic-with-assigned-post";

const topic = topicWithAssignedPost();
const post = topic.post_stream.posts[1];

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
    await click(".modal-container #assignee-chooser-header .select-kit-header-wrapper");
    await click(".modal-container #assignee-chooser-header .select-kit-header-wrapper"); // fixme andrei get rid of the second click
    await fillIn(selectors.modal.assigneeInput, "username");
    await pauseTest();
    // set assignment comment
    await click(selectors.modal.assignButton);

    // check topic assignment
    assert.ok(true); // fixme andrei drop
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
