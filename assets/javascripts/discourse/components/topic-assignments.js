import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import I18n from "I18n";

export default class TopicAssignments extends Component {
  @tracked selectedAssignmentId;
  @tracked selectedAssignment;

  constructor() {
    super(...arguments);
    this.selectAssignment(0);
  }

  get assignmentOptions() {
    return this.args.assignments.map((a) => this.#toComboBoxOption(a));
  }

  @action
  selectAssignment(id) {
    this.selectedAssignmentId = id;
    if (id === 0) {
      this.selectedAssignment = this.args.assignments.find(
        (a) => a.targetType === "Topic"
      );
    } else {
      this.selectedAssignment = this.args.assignments.find(
        (a) => a.postNumber === id
      );
    }
  }

  #toComboBoxOption(assignment) {
    const topic = I18n.t("edit_assignments_modal.topic");
    const post = I18n.t("edit_assignments_modal.post");

    if (assignment.targetType === "Topic") {
      return {
        id: 0,
        name: topic,
      };
    } else {
      return {
        id: assignment.postNumber,
        name: `${post} #${assignment.postNumber}`,
      };
    }
  }
}
