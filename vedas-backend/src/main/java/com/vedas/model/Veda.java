package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "vedas")
public class Veda {

    @Id
    private String id;
    private String slug;
    private int order;
    private String sanskritName;
    private String transliteration;
    private List<LocalizedText> titles;
    private List<LocalizedText> descriptions;
    private String coverImageUrl;
    private int chapterCount;
    private int verseCount;
    private boolean active;

    private List<LocalizedText> overviews;
    private List<LocalizedText> significances;
    private List<LocalizedText> structures;
    private List<LocalizedText> historicalContexts;
    private List<LocalizedText> periods;
    private List<LocalizedText> divisionNames;
    private int divisionCount;
    private int mantraCount;
    private List<LocalizedText> compositionTypes;
    private List<LocalizedText> branches;
    private List<LocalizedText> specialFeatures;
    private List<String> primaryDeities;
    private List<LocalizedText> keyThemes;
    private List<LocalizedText> famousSages;

    private List<LocalizedText> philosophies;
    private List<LocalizedText> ritualsAndPractices;
    private List<LocalizedText> famousHymns;
    private List<LocalizedText> learningGuides;
    private List<LocalizedText> coreConcepts;
    private List<LocalizedText> modernRelevance;
    private List<LocalizedText> relatedTexts;
    private List<LocalizedText> pronunciationGuides;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public String getSanskritName() { return sanskritName; }
    public void setSanskritName(String sanskritName) { this.sanskritName = sanskritName; }
    public String getTransliteration() { return transliteration; }
    public void setTransliteration(String transliteration) { this.transliteration = transliteration; }
    public List<LocalizedText> getTitles() { return titles; }
    public void setTitles(List<LocalizedText> titles) { this.titles = titles; }
    public List<LocalizedText> getDescriptions() { return descriptions; }
    public void setDescriptions(List<LocalizedText> descriptions) { this.descriptions = descriptions; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public int getChapterCount() { return chapterCount; }
    public void setChapterCount(int chapterCount) { this.chapterCount = chapterCount; }
    public int getVerseCount() { return verseCount; }
    public void setVerseCount(int verseCount) { this.verseCount = verseCount; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public List<LocalizedText> getOverviews() { return overviews; }
    public void setOverviews(List<LocalizedText> overviews) { this.overviews = overviews; }
    public List<LocalizedText> getSignificances() { return significances; }
    public void setSignificances(List<LocalizedText> significances) { this.significances = significances; }
    public List<LocalizedText> getStructures() { return structures; }
    public void setStructures(List<LocalizedText> structures) { this.structures = structures; }
    public List<LocalizedText> getHistoricalContexts() { return historicalContexts; }
    public void setHistoricalContexts(List<LocalizedText> historicalContexts) { this.historicalContexts = historicalContexts; }
    public List<LocalizedText> getPeriods() { return periods; }
    public void setPeriods(List<LocalizedText> periods) { this.periods = periods; }
    public List<LocalizedText> getDivisionNames() { return divisionNames; }
    public void setDivisionNames(List<LocalizedText> divisionNames) { this.divisionNames = divisionNames; }
    public int getDivisionCount() { return divisionCount; }
    public void setDivisionCount(int divisionCount) { this.divisionCount = divisionCount; }
    public int getMantraCount() { return mantraCount; }
    public void setMantraCount(int mantraCount) { this.mantraCount = mantraCount; }
    public List<LocalizedText> getCompositionTypes() { return compositionTypes; }
    public void setCompositionTypes(List<LocalizedText> compositionTypes) { this.compositionTypes = compositionTypes; }
    public List<LocalizedText> getBranches() { return branches; }
    public void setBranches(List<LocalizedText> branches) { this.branches = branches; }
    public List<LocalizedText> getSpecialFeatures() { return specialFeatures; }
    public void setSpecialFeatures(List<LocalizedText> specialFeatures) { this.specialFeatures = specialFeatures; }
    public List<String> getPrimaryDeities() { return primaryDeities; }
    public void setPrimaryDeities(List<String> primaryDeities) { this.primaryDeities = primaryDeities; }
    public List<LocalizedText> getKeyThemes() { return keyThemes; }
    public void setKeyThemes(List<LocalizedText> keyThemes) { this.keyThemes = keyThemes; }
    public List<LocalizedText> getFamousSages() { return famousSages; }
    public void setFamousSages(List<LocalizedText> famousSages) { this.famousSages = famousSages; }
    public List<LocalizedText> getPhilosophies() { return philosophies; }
    public void setPhilosophies(List<LocalizedText> philosophies) { this.philosophies = philosophies; }
    public List<LocalizedText> getRitualsAndPractices() { return ritualsAndPractices; }
    public void setRitualsAndPractices(List<LocalizedText> ritualsAndPractices) { this.ritualsAndPractices = ritualsAndPractices; }
    public List<LocalizedText> getFamousHymns() { return famousHymns; }
    public void setFamousHymns(List<LocalizedText> famousHymns) { this.famousHymns = famousHymns; }
    public List<LocalizedText> getLearningGuides() { return learningGuides; }
    public void setLearningGuides(List<LocalizedText> learningGuides) { this.learningGuides = learningGuides; }
    public List<LocalizedText> getCoreConcepts() { return coreConcepts; }
    public void setCoreConcepts(List<LocalizedText> coreConcepts) { this.coreConcepts = coreConcepts; }
    public List<LocalizedText> getModernRelevance() { return modernRelevance; }
    public void setModernRelevance(List<LocalizedText> modernRelevance) { this.modernRelevance = modernRelevance; }
    public List<LocalizedText> getRelatedTexts() { return relatedTexts; }
    public void setRelatedTexts(List<LocalizedText> relatedTexts) { this.relatedTexts = relatedTexts; }
    public List<LocalizedText> getPronunciationGuides() { return pronunciationGuides; }
    public void setPronunciationGuides(List<LocalizedText> pronunciationGuides) { this.pronunciationGuides = pronunciationGuides; }
}
