# frozen_string_literal: true

describe "Assign | Assigned post popup menu", type: :system do
  let(:topic_page) { PageObjects::Pages::Topic.new }
  let(:assign_modal) { PageObjects::Modals::Assign.new }
  fab!(:staff_user) { Fabricate(:user, groups: [Group[:staff]]) }
  fab!(:admin)
  fab!(:topic)
  fab!(:post) { Fabricate(:post, topic: topic) }

  before do
    SiteSetting.assign_enabled = true

    # The system tests in this file are flaky and auth token related so turning this on
    SiteSetting.verbose_auth_token_logging = true

    sign_in(admin)
  end

  it "is an example" do
    visit "/t/#{topic.id}"

    topic_page.click_assign_topic
    assign_modal.assignee = staff_user
    assign_modal.confirm

    expect(assign_modal).to be_closed
    expect(topic_page).to have_assigned(user: staff_user, at_post: 2)
    expect(find("#topic .assigned-to")).to have_content(staff_user.username)

    topic_page.click_unassign_topic

    expect(topic_page).to have_unassigned(user: staff_user, at_post: 3)
    expect(page).to have_no_css("#topic .assigned-to")
  end

  it "unassigns the post" do
    # await visit("/t/assignment-topic/44");
    # await click(ellipsisButton);
    # await click(popupMenu.unassign);
    # assert
    #   .dom(".popup-menu")
    #   .doesNotExist("Popup menu has been closed");
    # assert
    #   .dom(".post-stream .topic-post .assigned-to")
    #   .exists();
  end

  it "reassigns the post" do
    # await visit("/t/assignment-topic/44");
    # await click(ellipsisButton);
    # await click(popupMenu.editAssignment);
    # // todo assert post is not assigned anymore
  end
end
