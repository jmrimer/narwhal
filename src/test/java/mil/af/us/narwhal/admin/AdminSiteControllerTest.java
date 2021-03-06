package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.BaseIntegrationTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;

public class AdminSiteControllerTest extends BaseIntegrationTest {
  @Before
  public void setUp() {
    super.setUp();
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void indexTest() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .when()
      .get(AdminSiteController.URI)
      .then()
      .statusCode(200)
      .body("$.size()", equalTo(1))
      .body("[0].siteId", greaterThan(0))
      .body("[0].siteName", equalTo("site"));
    //    // @formatter:on
  }
}
