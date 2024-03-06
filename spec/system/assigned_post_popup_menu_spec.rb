# frozen_string_literal: true

describe "Assign | Assigned post popup menu", type: :system do
  let(:topic_page) { PageObjects::Pages::Topic.new }
  let(:post_popup_menu) { PageObjects::PopupMenus::Post.new }
  let(:assign_modal) { PageObjects::Modals::Assign.new }

  fab!(:admin)
  fab!(:topic)
  fab!(:post) { Fabricate(:post, topic: topic) }
  fab!(:second_post) { Fabricate(:post, topic: topic) }
  # fab!(:staff_user) { Fabricate(:user, groups: [Group[:staff]]) }

  before do
    SiteSetting.assign_enabled = true
    sign_in(admin)
  end

  it "shows ellipsis button on assigned posts" do
    visit "/t/#{topic.id}"
    expect(topic_page).to have_ellipsis_button_on_post(second_post.id)
  end

  it "unassigns the post" do
    visit "/t/#{topic.id}"
    # post.click_ellipsis_button
    # post.click_unassign
    # expect(popup_menu).to be_closed
    # expect(post).to not_have_assigned
  end

  it "reassigns the post" do
    visit "/t/#{topic.id}"
    # post.click_ellipsis_button
    # post.click_unassign
    # expect(popup_menu).to be_closed
    # expect(post).to not_have_assigned
  end
end
