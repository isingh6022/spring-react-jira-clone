package com.jiraclone.contributor;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Contributor {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@Enumerated(EnumType.STRING)
	private Expertise expertise;

	protected Contributor() {
	}

	public Contributor(String name, Expertise expertise) {
		this.name = name;
		this.expertise = expertise;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public Expertise getExpertise() {
		return expertise;
	}

}
