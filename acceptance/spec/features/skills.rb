class Skill
  include Capybara::DSL
  include RSpec::Matchers
  attr_accessor :earn, :expiration, :qual_title, :cert_title
  require 'date'

  def initialize
    set_attrs
  end

  def create_invalid
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      click_link_or_button 'Add Skill'
      find('input[type="submit"]').click
    end
  end

  def create_qualification
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      click_link_or_button 'Add Skill'
      typeahead_select('.skill-type-filter', 'Qualification')
      typeahead_select('.skill-name-filter', 'HT - Instructor')
      continue_submission
    end
  end

  def update_qualification
    @expiration += 90
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      scroll_to(page.find('.currency-title', text: @qual_title))
      page.find('.currency-title', text: @qual_title).click
      page.all('.DateInput_input')[1].set('')
      page.all('.DateInput_input')[1].set(@expiration.strftime('%m/%d/%Y'))
      find('input[type="submit"]').click
    end
  end

  def delete_qualification
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      scroll_to(page.find('.currency-title', text: @qual_title))
      page.find('.currency-title', text: @qual_title).click
      click_link_or_button 'DELETE'
    end
    page.within('.actions') do
      click_link_or_button 'CONFIRM'
    end
    expect(page.has_content? 'Add Skill').to be true
  end

  def qualification_exists?
    page.within('.side-panel') do
      return page.has_content?('CURRENCY') && page.has_content?(@qual_title)
    end
  end

  def create_certification
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      click_link_or_button 'Add Skill'
      typeahead_select('.skill-type-filter', 'Certification')
      typeahead_select('.skill-name-filter', 'X-RAY VISION')
      continue_submission
    end
  end

  def update_certification
    @expiration += 90
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      scroll_to(page.find('.currency-title', text: @cert_title))
      page.find('.currency-title', text: @cert_title).click
      page.all('.DateInput_input')[1].set('')
      page.all('.DateInput_input')[1].set(@expiration.strftime('%m/%d/%Y'))
      find('input[type="submit"]').click
    end
  end

  def delete_certification
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      scroll_to(page.find('.currency-title', text: @cert_title))
      page.find('.currency-title', text: @cert_title).click
      click_link_or_button 'DELETE'
    end
    page.within('.actions') do
      click_link_or_button 'CONFIRM'
    end
    expect(page.has_content? 'Add Skill').to be true
  end

  def certification_exists?
    page.within('.side-panel') do
      return page.has_content?('CURRENCY') && page.has_content?(@cert_title)
    end
  end

  private

  def set_attrs
    @earn = DateTime.now
    @expiration = @earn + 90
    @qual_title = 'HT - Instructor'
    @cert_title = 'X-RAY VISION'
  end

  def continue_submission
    page.all('.DateInput_input')[0].set('')
    page.all('.DateInput_input')[0].set(@earn.strftime('%m/%d/%Y'))
    page.all('.DateInput_input')[1].set('')
    page.all('.DateInput_input')[1].set(@expiration.strftime('%m/%d/%Y'))
    page.all('.DateInput_input')[2].set('')
    page.all('.DateInput_input')[2].set(@expiration.strftime('%m/%d/%Y'))
    page.all('.DateInput_input')[3].set('')
    page.all('.DateInput_input')[3].set(@expiration.strftime('%m/%d/%Y'))
    find('input[type="submit"]').click
  end

  def scroll_to(element)
    script = <<-JS
      arguments[0].scrollIntoView(true);
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end

  def typeahead_select(className, value)
    page.within(className) do
      find('.rbt-input').click
      click_on(value);
    end
  end
end
