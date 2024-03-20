import { getOwner } from "@ember/application";
import { htmlSafe } from "@ember/template";
import { renderAvatar } from "discourse/helpers/user-avatar";
import { iconHTML } from "discourse-common/lib/icon-library";
import I18n from "I18n";

const DEPENDENT_KEYS = [
  "topic.assigned_to_user",
  "topic.assigned_to_group",
  "currentUser.can_assign",
  "topic.assigned_to_user.username",
];

export default {
  id: "reassign",
  dependentKeys: DEPENDENT_KEYS,
  classNames: ["reassign"],

  async action(id) {
    if (!this.currentUser?.can_assign) {
      return;
    }

    const taskActions = getOwner(this).lookup("service:task-actions");
    const firstPostId = this.topic.postStream.firstPostId;

    switch (id) {
      case "unassign": {
        this.set("topic.assigned_to_user", null);
        this.set("topic.assigned_to_group", null);

        await taskActions.unassign(this.topic.id);
        this.appEvents.trigger("post-stream:refresh", { id: firstPostId });
        break;
      }
      case "reassign-self": {
        this.set("topic.assigned_to_user", null);
        this.set("topic.assigned_to_group", null);

        await taskActions.reassignUserToTopic(this.currentUser, this.topic);
        this.appEvents.trigger("post-stream:refresh", { id: firstPostId });
        break;
      }
      case "reassign": {
        await taskActions.showAssignModal(this.topic, {
          targetType: "Topic",
          isAssigned: this.topic.isAssigned(),
          onSuccess: () =>
            this.appEvents.trigger("post-stream:refresh", { id: firstPostId }),
        });
        break;
      }
      default: {
        if (id.startsWith("unassign-from-post-")) {
          const postId = extractPostId(id);
          await taskActions.unassign(postId, "Post");
          delete this.topic.indirectly_assigned_to[postId];
          this.appEvents.trigger("post-stream:refresh", {
            id: this.topic.postStream.firstPostId,
          });
        }
      }
    }
  },

  noneItem() {
    const user = this.topic.assigned_to_user;
    const group = this.topic.assigned_to_group;
    const label = I18n.t("discourse_assign.unassign.title_w_ellipsis");
    const groupLabel = I18n.t("discourse_assign.unassign.title");

    if (user) {
      const avatar = avatarHtml(user, "tiny");
      return {
        id: null,
        name: I18n.t("discourse_assign.reassign_modal.title"),
        label: htmlSafe(
          `${avatar}<span class="unassign-label">${label}</span>`
        ),
      };
    } else if (group) {
      return {
        id: null,
        name: I18n.t("discourse_assign.reassign_modal.title"),
        label: htmlSafe(
          `<span class="unassign-label">${groupLabel}</span> @${group.name}...`
        ),
      };
    }
  },
  content() {
    const content = [];

    if (this.topic.isAssigned()) {
      content.push(unassignFromTopicButton(this.topic));
    }

    if (this.topic.hasAssignedPosts()) {
      content.push(...unassignFromPostButtons(this.topic));
    }

    if (showReassignSelfButton(this.topic, this.currentUser)) {
      content.push(reassignToSelfButton());
    }

    content.push(reassignButton());

    return content;
  },

  displayed() {
    return (
      this.currentUser?.can_assign &&
      !this.site.mobileView &&
      (this.topic.isAssigned() || this.topic.hasAssignedPosts())
    );
  },
};

function avatarHtml(user, size) {
  return renderAvatar(user, { imageSize: size, ignoreTitle: true });
}

function extractPostId(buttonId) {
  const start = buttonId.lastIndexOf("-") + 1;
  return buttonId.substring(start);
}

function reassignButton() {
  return {
    id: "reassign",
    name: I18n.t("discourse_assign.reassign.help"),
    label: htmlSafe(
      `${iconHTML("group-plus")} ${I18n.t(
        "discourse_assign.reassign.title_w_ellipsis"
      )}`
    ),
  };
}

function reassignToSelfButton() {
  return {
    id: "reassign-self",
    name: I18n.t("discourse_assign.reassign.to_self_help"),
    label: htmlSafe(
      `${iconHTML("user-plus")} ${I18n.t("discourse_assign.reassign.to_self")}`
    ),
  };
}

function showReassignSelfButton(topic, currentUser) {
  return (
    topic.isAssigned() &&
    topic.assigned_to_user?.username !== currentUser.username
  );
}

function unassignFromTopicButton(topic) {
  const username =
    topic.assigned_to_user?.username || topic.assigned_to_group?.name;
  const icon = topic.assigned_to_user
    ? avatarHtml(topic.assigned_to_user, "small")
    : iconHTML("user-times");
  const label = I18n.t("discourse_assign.unassign.long_title", { username });

  return {
    id: "unassign",
    name: I18n.t("discourse_assign.unassign.help", { username }),
    label: htmlSafe(`${icon} ${label}`),
  };
}

function unassignFromPostButtons(topic) {
  return Object.entries(topic.indirectly_assigned_to).map(
    ([postId, assignment]) => unassignFromPostButton(postId, assignment)
  );
}

function unassignFromPostButton(postId, assignment) {
  const avatar = avatarHtml(assignment.assigned_to, "small");
  const label = `Unassign @${assignment.assigned_to.username} from #${assignment.post_number}`; // fixme andrei
  return {
    id: `unassign-from-post-${postId}`,
    name: I18n.t("discourse_assign.reassign.help"), // fixme andrei
    label: htmlSafe(`${avatar} ${label}`),
  };
}
