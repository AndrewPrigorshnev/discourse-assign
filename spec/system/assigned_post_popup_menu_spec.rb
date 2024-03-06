# frozen_string_literal: true

describe "Assign | Assigned post popup menu", type: :system do
  let(:topic_page) { PageObjects::Pages::Topic.new }
  let(:post_popup_menu) { PageObjects::PopupMenus::Post.new }
  let(:assign_modal) { PageObjects::Modals::Assign.new }

  fab!(:user)
  fab!(:admin)
  fab!(:topic)
  fab!(:post) { Fabricate(:post, topic: topic) }
  fab!(:second_post) { Fabricate(:post, topic: topic) }
  fab!(:second_post_assignment) { Fabricate(:post_assignment, assigned_to: user, post: second_post) }


  before do
    SiteSetting.assign_enabled = true
    sign_in(admin)
  end

  it "shows the more button on assigned posts" do
    visit "/t/#{topic.id}"
    expect(topic_page).to have_more_button_on_post(2)
  end

  it "unassigns the post" do
    visit "/t/#{topic.id}"
    topic_page.click_more_button_on_post(2)
    post_popup_menu.click_unassign
    # expect(popup_menu).to be_closed
    # expect(post).to not_have_assigned
    expect(topic_page).to have_more_button_on_post(2)
  end

  it "reassigns the post" do
    visit "/t/#{topic.id}"
    # post.click_ellipsis_button
    # post.click_unassign
    # expect(popup_menu).to be_closed
    # expect(post).to not_have_assigned
  end
end
