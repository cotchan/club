package com.example.club_project.domain;

import com.example.club_project.repository.ClubRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@Transactional
@ExtendWith(SpringExtension.class)
@SpringBootTest
class ClubTest {

    @Autowired
    private ClubRepository clubRepository;

    @Test
    @DisplayName("Club Entity Validation 테스트")
    public void Club_Entity_Validation_test() {
        //given
        String validClubName = "열글자로맞춘동아리명";
        String invalidClubName = "열글자가 훨씬 넘는 잘못된 사이즈의 동아리명입니다.";
        String address = "address";
        String university = "university";
        String description = "description";

        Category category = Category.builder()
                .name("categoryName")
                .description(description)
                .build();

        //then
        Club club = Club.builder()
                .name(validClubName)
                .address(address)
                .university(university)
                .description(description)
                .category(category)
                .build();

        clubRepository.save(club);

        assertThrows(IllegalArgumentException.class, () -> Club.builder()
                                                                .name(invalidClubName)
                                                                .address(address)
                                                                .university(university)
                                                                .description(description)
                                                                .category(category)
                                                                .build());
    }
}