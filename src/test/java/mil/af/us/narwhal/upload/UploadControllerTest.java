package mil.af.us.narwhal.upload;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

public class UploadControllerTest extends BaseIntegrationTest {
  @Autowired private SiteRepository siteRepository;
  @Autowired private AirmanRepository airmanRepository;

  @Before
  public void setUp() {
    final Flight flight = new Flight("FLIGHT");

    final Squadron squad = new Squadron("SQUADRON");
    squad.addFlight(flight);

    final Site site = new Site("SITE");
    site.addSquadron(squad);

    siteRepository.save(site);
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void testImportAirmanCSV() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName,firstName,site,squadron,flight\nLast,First,SITE,SQUADRON,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen")
    .then()
      .statusCode(201);
    // @formatter:on

    assertThat(airmanRepository.count()).isEqualTo(count + 1);
  }

  @Test
  public void testImportAirmanCSV_handlesNullSite() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName,firstName,site,squadron,flight\nLast,First,SITE?,SQUADRON,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "Row(s) 1 contain errors.\n" +
      "Check that your sites and squadrons are identical to the ones on the tracker filters, eg. sites are formatted as DMS-TX and squadrons as 3 IS.");
    assertThat(airmanRepository.count()).isEqualTo(count);
  }

  @Test
  public void testImportAirmanCSV_handlesNullSquadrons() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName,firstName,site,squadron,flight\nLast,First,SITE,SQUADRON?,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "Row(s) 1 contain errors.\n" +
      "Check that your sites and squadrons are identical to the ones on the tracker filters, eg. sites are formatted as DMS-TX and squadrons as 3 IS.");
    assertThat(airmanRepository.count()).isEqualTo(count);
  }

  @Test
  public void testImportAirmanCSV_handlesBadHeaders() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName?,firstName?,site?,squadron?,flight?\nLast,First,SITE,SQUADRON,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful. Header is missing required fields [SITE,FLIGHT,LASTNAME,FIRSTNAME,SQUADRON]");
    assertThat(airmanRepository.count()).isEqualTo(count);
  }
}