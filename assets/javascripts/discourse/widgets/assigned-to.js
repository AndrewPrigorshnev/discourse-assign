import { getOwner } from "@ember/application";
import { hbs } from "ember-cli-htmlbars";
import { h } from "virtual-dom";
import RenderGlimmer from "discourse/widgets/render-glimmer";
import { iconNode } from "discourse-common/lib/icon-library";
import I18n from "I18n";

export const AssignedToWidget = ["assigned-to", {
  html() {
    return h("p.assigned-to", [
      this.icon(),
      this.label(),
      this.moreButton()
    ]);
  },

  icon() {
    return this.attrs.assignedToUser ?
      iconNode("user-plus")
      : iconNode("group-plus");
  },

  label() {
    let { assignedToUser, assignedToGroup, href } = this.attrs;

    return [h("span.assign-text", I18n.t("discourse_assign.assigned_to")),
      h(
        "a",
        { attributes: { class: "assigned-to-username", href } },
        assignedToUser ? assignedToUser.username : assignedToGroup.name
      )];
  },

  moreButton() {
    const taskActions = getOwner(this).lookup("service:task-actions");
    const post = this.attrs.post;

    return [
      new RenderGlimmer(
        this,
        "span",
        hbs`
          <DMenu>
            <:trigger>
              <DButton
                @icon="ellipsis-h"
                class="widget-button btn-flat btn-icon show-more-actions no-text"
              />
            </:trigger>
            <:content>
              <button class="btn-default popup-menu-button" {{on "click" @data.unassign}}>Unassign</button>
              <button class="btn-default popup-menu-button" {{on "click" @data.editAssignment}}>Edit assignment...</button>
            </:content>
          </DMenu>
        `,
        {
          unassign: () => taskActions.unassignPost(post),
          editAssignment: () => taskActions.showAssignPostModal(post)
        }
      )
    ];
  },
}];
