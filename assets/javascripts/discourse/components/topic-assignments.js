import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

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
    // fixme andrei strings
    if (assignment.targetType === "Topic") {
      return { id: 0, name: "Topic" };
    } else {
      return {
        id: assignment.postNumber,
        name: `Post #${assignment.postNumber}`,
      };
    }
  }
}
