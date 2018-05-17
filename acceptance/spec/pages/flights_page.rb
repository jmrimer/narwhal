class FlightsPage
  include Capybara::DSL
  include RSpec::Matchers

  def initialize
    visit '/flights'
    expect(page).to have_css('.airman-name')
  end

  def assert_shows_airmen
    expect(page).to have_css('.airman-name', minimum: 1)
  end

  def assert_shows_certifications
    expect(page).to have_css('.certification-row', minimum: 1)
  end

  def assert_shows_airman
    click_on_airman('Angie, Patton')
    expect(page).to have_content('94 IS')
    expect(page).to have_content('DMS Maryland')
  end

  def assert_edit_airman
    click_on_airman('Angie, Patton')

    fill_in 'lastName', with: 'Bob'
    fill_in 'firstName', with: 'Sponge'
    find('#airman-site').find(:option, text: 'DGS 1').select_option
    find('#airman-squadron').find(:option, text: '30 IS').select_option
    find('#airman-flight').find(:option, text: 'JKB').select_option
    find('#airman-schedule').find(:option, text: 'Back Half').select_option
    find('#airman-shift').find(:option, text: 'Day').select_option
    find('#airman-rank').find(:option, text: 'SSgt').select_option

    find('input[type="submit"]').click

    expect(page).to have_content 'Bob, Sponge'
    expect(find('#airman-site').value).to eq '1'
    expect(find('#airman-squadron').value).to eq '1'
    expect(find('#airman-flight').value).to eq '3'
    expect(find('#airman-schedule').value).to eq '3'
    expect(find('#airman-shift').value).to eq 'Day'
    expect(find('#airman-rank').value).to eq '6'

    fill_in 'lastName', with: 'Angie'
    fill_in 'firstName', with: 'Patton'
    find('#airman-site').find(:option, text: 'DMS Maryland').select_option
    find('#airman-squadron').find(:option, text: '94 IS').select_option
    find('#airman-flight').find(:option, text: 'DOB').select_option
    find('#airman-schedule').find(:option, text: 'No Schedule').select_option
    find('#airman-shift').find(:option, text: 'Night').select_option
    find('#airman-rank').find(:option, text: 'No Rank').select_option

    find('input[type="submit"]').click

    expect(page).to have_content 'Angie, Patton'
    expect(find('#airman-site').value).to eq '14'
    expect(find('#airman-squadron').value).to eq '16'
    expect(find('#airman-flight').value).to eq '1'
    expect(find('#airman-schedule').value).to eq '1'
    expect(find('#airman-shift').value).to eq 'Night'
    expect(find('#airman-rank').value).to eq '1'
  end

  def assert_edit_certification
    click_on_certification('LASER VISION')

    expect(page).to have_content 'LASER VISION'

    fill_in 'Acronym', with: 'Frost Breath'

    find('input[type="submit"]').click

    expect(page).to have_content 'FROST BREATH'

    fill_in 'Acronym', with: 'LASER VISION'

    find('input[type="submit"]').click

    expect(page).to have_content 'LASER VISION'
  end

  def assert_create_airman
    page.find('span', text: 'New Operator').click
    fill_in 'lastName', with: 'Aaron'
    fill_in 'firstName', with: 'Aadam'
    find('#airman-site').find(:option, text: 'DMS Maryland').select_option

    find('input[type="submit"]').click

    visit '/flights'
    expect(page).to have_content 'Aaron, Aadam'
  end


  private

  def click_on_airman(name)
    page.find('a', text: name).click
    expect(page).to have_content('Personal Information')
  end

  def click_on_certification(name)
    page.find('a', text: name).click
    expect(page).to have_content('Certification')
  end
end