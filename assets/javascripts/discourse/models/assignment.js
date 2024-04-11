import { tracked } from "@glimmer/tracking";
import EmberObject from "@ember/object";

export class Assignment extends EmberObject {
  static fromTopic(topic) {
    return new Assignment(
      topic.assigned_to_user?.username,
      topic.assigned_to_group?.name,
      topic.assignment_status,
      topic.assignment_note,
      topic.id,
      "Topic"
    );
  }

  // to-do rename to groupName, some components use both this model
  // and models from server, that's why we have to call it "group_name" now
  @tracked group_name;
  @tracked username;
  @tracked status;
  @tracked note;
  targetId;
  targetType;
  postNumber;

  constructor(
    username,
    groupName,
    status,
    note,
    targetId,
    targetType,
    postNumber
  ) {
    super();
    this.username = username;
    this.group_name = groupName;
    this.status = status;
    this.note = note;
    this.targetId = targetId;
    this.targetType = targetType;
    this.postNumber = postNumber;
  }
}
