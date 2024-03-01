import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { on } from "@ember/modifier";

export default class EditPostAssignment extends Component {
  @service taskActions;

  @action
  async editAssignment() {
    this.taskActions.showAssignModal(this.args.post, {
      targetType: "Post",
    });
  }

  <template>
    <button {{on "click" this.editAssignment}}>Edit assignment...</button>
  </template>
}
