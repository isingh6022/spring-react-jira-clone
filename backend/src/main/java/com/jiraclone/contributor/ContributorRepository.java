package com.jiraclone.contributor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContributorRepository extends JpaRepository<Contributor, Long> {

	List<Contributor> findAllByOrderByNameAsc();

	List<Contributor> findByExpertiseOrderByNameAsc(Expertise expertise);

}
