import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { on } from "@ember/modifier";

export default class UnassignMenuButton extends Component {
  @service taskActions;
  @service router;

  @action
  async unassign() {
    console.log("unassigning...");
  }

  <template>
    <button {{on "click" this.unassign}}>Unassign</button>
  </template>
}
