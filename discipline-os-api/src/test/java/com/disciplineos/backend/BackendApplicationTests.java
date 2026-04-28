package com.disciplineos.backend;

import com.disciplineos.backend.repository.DailyReflectionRepository;
import com.disciplineos.backend.repository.DailyScoreRepository;
import com.disciplineos.backend.repository.HabitRepository;
import com.disciplineos.backend.repository.IdentityRepository;
import com.disciplineos.backend.repository.RoleRepository;
import com.disciplineos.backend.repository.TaskRepository;
import com.disciplineos.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestPropertySource(properties = {
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration"
})
class BackendApplicationTests {

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private TaskRepository taskRepository;

    @MockBean
    private HabitRepository habitRepository;

    @MockBean
    private IdentityRepository identityRepository;

    @MockBean
    private DailyReflectionRepository dailyReflectionRepository;

    @MockBean
    private DailyScoreRepository dailyScoreRepository;

    @Test
    void contextLoads() {
    }

}
