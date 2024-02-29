import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";
import I18n from "I18n";

export const AssignedTo = {
  html(attrs) {
    let { assignedToUser, assignedToGroup, href } = attrs;

    return h("p.assigned-to", [
      assignedToUser ? iconNode("user-plus") : iconNode("group-plus"),
      h("span.assign-text", I18n.t("discourse_assign.assigned_to")),
      h(
        "a",
        { attributes: { class: "assigned-to-username", href } },
        assignedToUser ? assignedToUser.username : assignedToGroup.name
      ),
      this.moreButton()
    ]);
  },

  moreButton() {
    return this.attach("flat-button", {
      title: "show_more",
      className: "show-more-actions",
      icon: "ellipsis-h"
    });
  }
};
