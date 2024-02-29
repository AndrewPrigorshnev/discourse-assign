import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";
import I18n from "I18n";

export const AssignedToWidget = ["assigned-to", {
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
      action: "toggleMoreMenu",
      title: "show_more",
      className: "show-more-button",
      icon: "ellipsis-h"
    });
  },

  toggleMoreMenu() {
    const buttonElement = document.querySelector(".show-more-button")[0];

    this.menu.show(buttonElement, {
      identifier: "more-menu",
      content: "Menu Content",
      // component: AdminPostMenu,
      extraClassName: "popup-menu",
      data: {},
    });
  }
}];
