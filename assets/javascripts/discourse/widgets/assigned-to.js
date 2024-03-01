import { hbs } from "ember-cli-htmlbars";
import { h } from "virtual-dom";
import RenderGlimmer from "discourse/widgets/render-glimmer";
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
      return [
        new RenderGlimmer(
          this,
          "div.my-wrapper-class", // fixme andrei drop or correct css class
          hbs`<DMenu @inline={{true}} @label="...">
            <button>Unassign</button>
            <button>Edit assignment...</button>
          </DMenu>
          `,
        ),
      ];
  }
}];
