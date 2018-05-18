require 'capybara/rspec'
require 'selenium-webdriver'
require 'chromedriver/helper'

Capybara.register_driver :chrome do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.register_driver :headless_chrome do |app|
  Capybara::Selenium::Driver.new(
    app,
    browser: :chrome,
    options: Selenium::WebDriver::Chrome::Options.new(args: %w[no-sandbox headless disable-gpu]),
  )
end

Capybara.configure do |config|
  config.run_server = false
  config.default_driver = :chrome
  config.app_host = ENV['REACT_APP_HOST'] || 'http://localhost:8080'
end

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups

  config.filter_run_when_matching :focus

  # config.example_status_persistence_file_path = "spec/examples.txt"

  # config.disable_monkey_patching!

  # config.warnings = true

  if config.files_to_run.one?
    config.default_formatter = 'doc'
  end

  config.profile_examples = 5

  config.order = :random

  Kernel.srand config.seed

  Chromedriver.set_version "2.36"
end
