package mil.af.us.narwhal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/dashboard/**").setViewName("/index.html");
    registry.addViewController("/upload").setViewName("/index.html");
    registry.addViewController("/admin").setViewName("/index.html");
    registry.addViewController("/flights/**").setViewName("/index.html");
    registry.addViewController("/certifications/**").setViewName("/index.html");
  }
}
