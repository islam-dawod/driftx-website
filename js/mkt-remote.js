/* DRIFTX AI Marketing — server bridge.
   When /api is reachable the system runs in server mode: real sessions, state
   shared across the team, and live ad-platform data. When it is not, the app
   falls back to the local browser mode it shipped with. */
window.MKT_REMOTE = (function () {
  "use strict";
  var BASE = "/api";
  var health = null;          /* last /health payload */
  var payload = null;         /* last /data payload */
  var saveTimer = null;
  var listeners = [];

  function on(fn) { listeners.push(fn); }
  function emit() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }

  function req(path, opts) {
    opts = opts || {};
    return fetch(BASE + path, {
      method: opts.method || "GET",
      credentials: "same-origin",
      headers: opts.body ? { "Content-Type": "application/json" } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) {}
        return { status: r.status, ok: r.ok, json: j, text: t };
      });
    }).catch(function (e) {
      return { status: 0, ok: false, json: null, text: String(e) };
    });
  }

  /* ---------------- capability probe ---------------- */
  function probe() {
    return req("/health").then(function (r) {
      health = (r.json && r.json.ok) ? r.json : null;
      return health;
    });
  }
  /* server mode = API answered, database ready, at least one user created */
  function serverMode() {
    return !!(health && health.configured && health.db && health.tables && health.users > 0);
  }
  function serverReachable() { return !!health; }
  function serverStatus() { return health; }

  /* ---------------- auth ---------------- */
  function me() {
    return req("/auth/me").then(function (r) { return (r.json && r.json.user) || null; });
  }
  function login(email, password) {
    return req("/auth/login", { method: "POST", body: { email: email, password: password } })
      .then(function (r) {
        if (r.ok && r.json && r.json.ok) return { ok: true, user: r.json.user };
        return { ok: false, error: (r.json && r.json.error) || ("http_" + r.status) };
      });
  }
  function logout() { return req("/auth/logout", { method: "POST" }); }

  /* ---------------- projects ---------------- */
  var projectId = null;
  var projectList = [];
  function getProject() {
    if (projectId) return projectId;
    try {
      var v = localStorage.getItem("driftx_project");
      if (v) { projectId = parseInt(v, 10) || null; }
    } catch (e) {}
    return projectId;
  }
  function setProject(id) {
    projectId = id ? parseInt(String(id), 10) : null;
    try {
      if (projectId) localStorage.setItem("driftx_project", String(projectId));
      else localStorage.removeItem("driftx_project");
    } catch (e) {}
  }
  function projects() { return projectList; }
  function qp(sep) {
    var p = getProject();
    return p ? (sep + "project=" + p) : "";
  }
  function loadProjects() {
    return req("/projects").then(function (r) {
      if (r.json && r.json.ok) {
        projectList = r.json.projects || [];
        if (!getProject() && r.json.defaultId) setProject(r.json.defaultId);
      }
      return projectList;
    });
  }
  function createProject(body) {
    return req("/projects", { method: "POST", body: body }).then(function (r) {
      if (r.json && r.json.projects) projectList = r.json.projects;
      return r.json || { ok: false, error: "http_" + r.status };
    });
  }
  function updateProject(id, body) {
    return req("/projects/" + id, { method: "PUT", body: body }).then(function (r) {
      if (r.json && r.json.projects) projectList = r.json.projects;
      return r.json || { ok: false, error: "http_" + r.status };
    });
  }
  function addAccount(id, body) {
    return req("/projects/" + id + "/accounts", { method: "POST", body: body }).then(function (r) {
      if (r.json && r.json.projects) projectList = r.json.projects;
      return r.json || { ok: false, error: "http_" + r.status };
    });
  }
  function removeAccount(id, rowId) {
    return req("/projects/" + id + "/accounts/" + rowId, { method: "DELETE" }).then(function (r) {
      if (r.json && r.json.projects) projectList = r.json.projects;
      return r.json || { ok: false, error: "http_" + r.status };
    });
  }

  /* ---------------- shared state ---------------- */
  function loadState() {
    return req("/state" + qp("?")).then(function (r) {
      return (r.json && r.json.ok && r.json.state && typeof r.json.state === "object") ? r.json.state : null;
    });
  }
  /* debounced: the UI writes state on every click, the server sees one write */
  function saveState(state) {
    if (!serverMode()) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = null;
      req("/state" + qp("?"), { method: "PUT", body: { state: state } });
    }, 700);
  }

  /* ---------------- data ---------------- */
  function loadData(range) {
    return req("/data?range=" + (range || 30) + qp("&")).then(function (r) {
      payload = (r.json && r.json.ok) ? r.json : null;
      if (payload) {
        if (payload.projects) projectList = payload.projects;
        if (!getProject() && payload.projectId) setProject(payload.projectId);
      }
      return payload;
    });
  }
  function data() { return payload; }
  function sync(provider, onlyThisProject) {
    var url = "/sync?provider=" + (provider || "all");
    if (onlyThisProject) url += qp("&");
    return req(url, { method: "POST" }).then(function (r) {
      return r.json || { ok: false, error: "http_" + r.status };
    });
  }
  function connections() {
    return req("/connections").then(function (r) { return (r.json && r.json.connections) || null; });
  }

  return {
    probe: probe, serverMode: serverMode, serverReachable: serverReachable, serverStatus: serverStatus,
    me: me, login: login, logout: logout,
    loadState: loadState, saveState: saveState,
    getProject: getProject, setProject: setProject, projects: projects, loadProjects: loadProjects,
    createProject: createProject, updateProject: updateProject, addAccount: addAccount, removeAccount: removeAccount,
    loadData: loadData, data: data, sync: sync, connections: connections,
    on: on, emit: emit
  };
})();
