package medicod.configuration;

import org.jooq.ConnectionProvider;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DataSourceConnectionProvider;
import org.jooq.impl.DefaultConfiguration;
import org.jooq.impl.DefaultDSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class JooqConfig {

    @Autowired
    private DataSource dataSource;

    @Bean
    public DSLContext context() {
        return new DefaultDSLContext(configuration());
    }

    public org.jooq.Configuration configuration() {
        return new DefaultConfiguration()
                .set(connectionProvider())
                .set(SQLDialect.MYSQL);
    }

    @Bean
    public ConnectionProvider connectionProvider() {
        return new DataSourceConnectionProvider(dataSource);
    }

}
