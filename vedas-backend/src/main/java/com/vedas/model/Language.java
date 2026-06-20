package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "languages")
public class Language {

    @Id
    private String id;
    private String code;
    private String name;
    private String nativeName;
    private String script;
    private boolean rtl;
    private boolean active;

    public Language() {}

    public Language(String code, String name, String nativeName, String script, boolean rtl) {
        this.code = code;
        this.name = name;
        this.nativeName = nativeName;
        this.script = script;
        this.rtl = rtl;
        this.active = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNativeName() { return nativeName; }
    public void setNativeName(String nativeName) { this.nativeName = nativeName; }
    public String getScript() { return script; }
    public void setScript(String script) { this.script = script; }
    public boolean isRtl() { return rtl; }
    public void setRtl(boolean rtl) { this.rtl = rtl; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
