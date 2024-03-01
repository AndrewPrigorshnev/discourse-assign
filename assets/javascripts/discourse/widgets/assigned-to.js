import { hbs } from "ember-cli-htmlbars";
import { h } from "virtual-dom";
import RenderGlimmer from "discourse/widgets/render-glimmer";
import { iconNode } from "discourse-common/lib/icon-library";
import I18n from "I18n";

export const AssignedToWidget = ["assigned-to", {
  html(attrs) {
    return h("p.assigned-to", [
      this.icon(attrs),
      this.label(attrs),
      this.moreButton()
    ]);
  },

  icon(attrs) {
    return attrs.assignedToUser ?
      iconNode("user-plus")
      : iconNode("group-plus");
  },

  label(attrs) {
    let { assignedToUser, assignedToGroup, href } = attrs;

    return [h("span.assign-text", I18n.t("discourse_assign.assigned_to")),
      h(
        "a",
        { attributes: { class: "assigned-to-username", href } },
        assignedToUser ? assignedToUser.username : assignedToGroup.name
      )];
  },

  moreButton() {
    return [
      new RenderGlimmer(
        this,
        "div.my-wrapper-class", // fixme andrei drop or correct css class
        hbs`
          <DMenu @inline={{true}} @label="...">
            <UnassignMenuButton @postId={{@data.postId}} />
            <EditAssignmentMenuButton />
          </DMenu>
        `,
        {
          postId: 1,
        }
      )
    ];
  }
}];
