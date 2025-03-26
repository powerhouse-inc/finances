var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  AtlasExploratory_EAtlasType: () => AtlasExploratory_EAtlasType,
  AtlasExploratory_EGlobalTag: () => AtlasExploratory_EGlobalTag,
  AtlasExploratory_EStatus: () => AtlasExploratory_EStatus,
  AtlasFoundation_FAtlasType: () => AtlasFoundation_FAtlasType,
  AtlasFoundation_FGlobalTag: () => AtlasFoundation_FGlobalTag,
  AtlasFoundation_FStatus: () => AtlasFoundation_FStatus,
  AtlasGrounding_GAtlasType: () => AtlasGrounding_GAtlasType,
  AtlasGrounding_GGlobalTag: () => AtlasGrounding_GGlobalTag,
  AtlasGrounding_GStatus: () => AtlasGrounding_GStatus,
  AtlasMultiParent_MAtlasType: () => AtlasMultiParent_MAtlasType,
  AtlasMultiParent_MGlobalTag: () => AtlasMultiParent_MGlobalTag,
  AtlasMultiParent_MStatus: () => AtlasMultiParent_MStatus,
  AtlasScope_GlobalTag: () => AtlasScope_GlobalTag,
  AtlasScope_Status: () => AtlasScope_Status,
  DocumentDrive_TransmitterType: () => DocumentDrive_TransmitterType,
  DocumentDrive_TriggerType: () => DocumentDrive_TriggerType,
  GAtlasType: () => GAtlasType,
  GGlobalTag: () => GGlobalTag,
  GStatus: () => GStatus,
  client: () => client,
  default: () => stdin_default
});
module.exports = __toCommonJS(stdin_exports);
var import_endpoint = require("graphql-ts-client/dist/endpoint");
const formatGraphQL = (query) => query;
const AtlasScope_Status = {
  approved: "APPROVED",
  archived: "ARCHIVED",
  deferred: "DEFERRED",
  placeholder: "PLACEHOLDER",
  provisional: "PROVISIONAL"
};
const AtlasScope_GlobalTag = {
  anonWorkforce: "ANON_WORKFORCE",
  avc: "AVC",
  cais: "CAIS",
  daoToolkit: "DAO_TOOLKIT",
  ecosystemIntelligence: "ECOSYSTEM_INTELLIGENCE",
  externalReference: "EXTERNAL_REFERENCE",
  facilitatordao: "FACILITATORDAO",
  internalReference: "INTERNAL_REFERENCE",
  legacyTermUseApproved: "LEGACY_TERM_USE_APPROVED",
  mlDefer: "ML_DEFER",
  mlHighPriority: "ML_HIGH_PRIORITY",
  mlLowPriority: "ML_LOW_PRIORITY",
  mlMedPriority: "ML_MED_PRIORITY",
  mlSupportDocsNeeded: "ML_SUPPORT_DOCS_NEEDED",
  newchain: "NEWCHAIN",
  p0HubEntryNeeded: "P0_HUB_ENTRY_NEEDED",
  purposeSystem: "PURPOSE_SYSTEM",
  recursiveImprovement: "RECURSIVE_IMPROVEMENT",
  scopeAdvisor: "SCOPE_ADVISOR",
  subdaoIncubation: "SUBDAO_INCUBATION",
  subdaoRewards: "SUBDAO_REWARDS",
  twoStageBridge: "TWO_STAGE_BRIDGE",
  v1Mip: "V1_MIP"
};
const AtlasMultiParent_MAtlasType = {
  annotation: "ANNOTATION",
  neededResearch: "NEEDED_RESEARCH"
};
const AtlasMultiParent_MStatus = {
  approved: "APPROVED",
  archived: "ARCHIVED",
  deferred: "DEFERRED",
  placeholder: "PLACEHOLDER",
  provisional: "PROVISIONAL"
};
const AtlasMultiParent_MGlobalTag = {
  avc: "AVC",
  cais: "CAIS",
  daoToolkit: "DAO_TOOLKIT",
  ecosystemIntelligence: "ECOSYSTEM_INTELLIGENCE",
  externalReference: "EXTERNAL_REFERENCE",
  legacyTermUseApproved: "LEGACY_TERM_USE_APPROVED",
  mlDefer: "ML_DEFER",
  mlLowPriority: "ML_LOW_PRIORITY",
  mlSupportDocsNeeded: "ML_SUPPORT_DOCS_NEEDED",
  newchain: "NEWCHAIN",
  purposeSystem: "PURPOSE_SYSTEM",
  recursiveImprovement: "RECURSIVE_IMPROVEMENT",
  scopeAdvisor: "SCOPE_ADVISOR",
  twoStageBridge: "TWO_STAGE_BRIDGE"
};
const AtlasExploratory_EAtlasType = {
  scenario: "SCENARIO",
  scenarioVariation: "SCENARIO_VARIATION"
};
const AtlasExploratory_EStatus = {
  approved: "APPROVED",
  archived: "ARCHIVED",
  deferred: "DEFERRED",
  placeholder: "PLACEHOLDER",
  provisional: "PROVISIONAL"
};
const AtlasExploratory_EGlobalTag = {
  avc: "AVC",
  cais: "CAIS",
  daoToolkit: "DAO_TOOLKIT",
  ecosystemIntelligence: "ECOSYSTEM_INTELLIGENCE",
  externalReference: "EXTERNAL_REFERENCE",
  legacyTermUseApproved: "LEGACY_TERM_USE_APPROVED",
  mlDefer: "ML_DEFER",
  mlLowPriority: "ML_LOW_PRIORITY",
  mlSupportDocsNeeded: "ML_SUPPORT_DOCS_NEEDED",
  newchain: "NEWCHAIN",
  purposeSystem: "PURPOSE_SYSTEM",
  recursiveImprovement: "RECURSIVE_IMPROVEMENT",
  scopeAdvisor: "SCOPE_ADVISOR",
  twoStageBridge: "TWO_STAGE_BRIDGE"
};
const AtlasFoundation_FAtlasType = {
  activeDataController: "ACTIVE_DATA_CONTROLLER",
  article: "ARTICLE",
  core: "CORE",
  section: "SECTION"
};
const AtlasFoundation_FStatus = {
  approved: "APPROVED",
  archived: "ARCHIVED",
  deferred: "DEFERRED",
  placeholder: "PLACEHOLDER",
  provisional: "PROVISIONAL"
};
const AtlasFoundation_FGlobalTag = {
  avc: "AVC",
  cais: "CAIS",
  daoToolkit: "DAO_TOOLKIT",
  ecosystemIntelligence: "ECOSYSTEM_INTELLIGENCE",
  externalReference: "EXTERNAL_REFERENCE",
  legacyTermUseApproved: "LEGACY_TERM_USE_APPROVED",
  mlDefer: "ML_DEFER",
  mlLowPriority: "ML_LOW_PRIORITY",
  mlSupportDocsNeeded: "ML_SUPPORT_DOCS_NEEDED",
  newchain: "NEWCHAIN",
  purposeSystem: "PURPOSE_SYSTEM",
  recursiveImprovement: "RECURSIVE_IMPROVEMENT",
  scopeAdvisor: "SCOPE_ADVISOR",
  twoStageBridge: "TWO_STAGE_BRIDGE"
};
const AtlasGrounding_GAtlasType = {
  activeData: "ACTIVE_DATA",
  originalContextData: "ORIGINAL_CONTEXT_DATA",
  tenet: "TENET"
};
const AtlasGrounding_GStatus = {
  approved: "APPROVED",
  archived: "ARCHIVED",
  deferred: "DEFERRED",
  placeholder: "PLACEHOLDER",
  provisional: "PROVISIONAL"
};
const AtlasGrounding_GGlobalTag = {
  avc: "AVC",
  cais: "CAIS",
  daoToolkit: "DAO_TOOLKIT",
  ecosystemIntelligence: "ECOSYSTEM_INTELLIGENCE",
  externalReference: "EXTERNAL_REFERENCE",
  legacyTermUseApproved: "LEGACY_TERM_USE_APPROVED",
  mlDefer: "ML_DEFER",
  mlLowPriority: "ML_LOW_PRIORITY",
  mlSupportDocsNeeded: "ML_SUPPORT_DOCS_NEEDED",
  newchain: "NEWCHAIN",
  purposeSystem: "PURPOSE_SYSTEM",
  recursiveImprovement: "RECURSIVE_IMPROVEMENT",
  scopeAdvisor: "SCOPE_ADVISOR",
  twoStageBridge: "TWO_STAGE_BRIDGE"
};
const DocumentDrive_TransmitterType = {
  internal: "Internal",
  matrixConnect: "MatrixConnect",
  pullResponder: "PullResponder",
  rESTWebhook: "RESTWebhook",
  secureConnect: "SecureConnect",
  switchboardPush: "SwitchboardPush"
};
const DocumentDrive_TriggerType = { pullResponder: "PullResponder" };
const GAtlasType = {
  activeData: "ACTIVE_DATA",
  originalContextData: "ORIGINAL_CONTEXT_DATA",
  tenet: "TENET"
};
const GStatus = {
  approved: "APPROVED",
  archived: "ARCHIVED",
  deferred: "DEFERRED",
  placeholder: "PLACEHOLDER",
  provisional: "PROVISIONAL"
};
const GGlobalTag = {
  avc: "AVC",
  cais: "CAIS",
  daoToolkit: "DAO_TOOLKIT",
  ecosystemIntelligence: "ECOSYSTEM_INTELLIGENCE",
  externalReference: "EXTERNAL_REFERENCE",
  legacyTermUseApproved: "LEGACY_TERM_USE_APPROVED",
  mlDefer: "ML_DEFER",
  mlLowPriority: "ML_LOW_PRIORITY",
  mlSupportDocsNeeded: "ML_SUPPORT_DOCS_NEEDED",
  newchain: "NEWCHAIN",
  purposeSystem: "PURPOSE_SYSTEM",
  recursiveImprovement: "RECURSIVE_IMPROVEMENT",
  scopeAdvisor: "SCOPE_ADVISOR",
  twoStageBridge: "TWO_STAGE_BRIDGE"
};
const typesTree = {
  AtlasScope: {
    get operations() {
      return {
        __fields: typesTree.Operation,
        __args: {
          skip: "Int",
          first: "Int"
        }
      };
    },
    get initialState() {
      return {
        __fields: typesTree.AtlasScope_AtlasScopeState
      };
    },
    get state() {
      return {
        __fields: typesTree.AtlasScope_AtlasScopeState
      };
    }
  },
  AtlasMultiParent: {
    get operations() {
      return {
        __fields: typesTree.Operation,
        __args: {
          skip: "Int",
          first: "Int"
        }
      };
    },
    get initialState() {
      return {
        __fields: typesTree.AtlasMultiParent_AtlasMultiParentState
      };
    },
    get state() {
      return {
        __fields: typesTree.AtlasMultiParent_AtlasMultiParentState
      };
    }
  },
  AtlasExploratory: {
    get operations() {
      return {
        __fields: typesTree.Operation,
        __args: {
          skip: "Int",
          first: "Int"
        }
      };
    },
    get initialState() {
      return {
        __fields: typesTree.AtlasExploratory_AtlasExploratoryState
      };
    },
    get state() {
      return {
        __fields: typesTree.AtlasExploratory_AtlasExploratoryState
      };
    }
  },
  AtlasFoundation: {
    get operations() {
      return {
        __fields: typesTree.Operation,
        __args: {
          skip: "Int",
          first: "Int"
        }
      };
    },
    get initialState() {
      return {
        __fields: typesTree.AtlasFoundation_AtlasFoundationState
      };
    },
    get state() {
      return {
        __fields: typesTree.AtlasFoundation_AtlasFoundationState
      };
    }
  },
  AtlasGrounding: {
    get operations() {
      return {
        __fields: typesTree.Operation,
        __args: {
          skip: "Int",
          first: "Int"
        }
      };
    },
    get initialState() {
      return {
        __fields: typesTree.AtlasGrounding_AtlasGroundingState
      };
    },
    get state() {
      return {
        __fields: typesTree.AtlasGrounding_AtlasGroundingState
      };
    }
  },
  DocumentModel: {
    get operations() {
      return {
        __fields: typesTree.Operation,
        __args: {
          skip: "Int",
          first: "Int"
        }
      };
    }
  },
  DocumentDrive: {
    get operations() {
      return {
        __fields: typesTree.Operation,
        __args: {
          skip: "Int",
          first: "Int"
        }
      };
    },
    get initialState() {
      return {
        __fields: typesTree.DocumentDrive_DocumentDriveState
      };
    },
    get state() {
      return {
        __fields: typesTree.DocumentDrive_DocumentDriveState
      };
    }
  },
  Mutation: {
    get AtlasGrounding_createDocument() {
      return {
        __args: {
          driveId: "String",
          name: "String"
        }
      };
    },
    get AtlasGrounding_setGroundingName() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_SetGroundingNameInput"
        }
      };
    },
    get AtlasGrounding_setDocNumber() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_SetDocNumberInput"
        }
      };
    },
    get AtlasGrounding_setContent() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_SetContentInput"
        }
      };
    },
    get AtlasGrounding_setMasterStatus() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_SetMasterStatusInput"
        }
      };
    },
    get AtlasGrounding_setAtlasType() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_SetAtlasTypeInput"
        }
      };
    },
    get AtlasGrounding_setParent() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_SetParentInput"
        }
      };
    },
    get AtlasGrounding_addTags() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_AddTagsInput"
        }
      };
    },
    get AtlasGrounding_removeTags() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_RemoveTagsInput"
        }
      };
    },
    get AtlasGrounding_addContextData() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_AddContextDataInput"
        }
      };
    },
    get AtlasGrounding_removeContextData() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_RemoveContextDataInput"
        }
      };
    },
    get AtlasGrounding_setProvenance() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_SetProvenanceInput"
        }
      };
    },
    get AtlasGrounding_setNotionId() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_SetNotionIdInput"
        }
      };
    },
    get AtlasGrounding_addReference() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_AddReferenceInput"
        }
      };
    },
    get AtlasGrounding_removeReference() {
      return {
        __args: {
          driveId: "String",
          docId: "PHID",
          input: "AtlasGrounding_RemoveReferenceInput"
        }
      };
    }
  },
  PHOperationContext: {
    get signer() {
      return {
        __fields: typesTree.Signer
      };
    }
  },
  Signer: {
    user: {},
    app: {},
    signatures: {}
  },
  Operation: {
    get context() {
      return {
        __fields: typesTree.PHOperationContext
      };
    }
  },
  AtlasScope_AtlasScopeState: {
    globalTags: {},
    originalContextData: {}
  },
  AtlasMultiParent_AtlasMultiParentState: {
    parents: {},
    globalTags: {},
    references: {},
    originalContextData: {},
    provenance: {}
  },
  AtlasExploratory_AtlasExploratoryState: {
    globalTags: {},
    references: {},
    originalContextData: {},
    findings: {}
  },
  AtlasFoundation_AtlasFoundationState: {
    parent: {},
    globalTags: {},
    references: {},
    originalContextData: {},
    provenance: {}
  },
  AtlasGrounding_AtlasGroundingState: {
    parent: {},
    globalTags: {},
    references: {},
    originalContextData: {},
    provenance: {}
  },
  DocumentDrive_FileNode: {
    synchronizationUnits: {}
  },
  DocumentDrive_DocumentDriveState: {
    nodes: {}
  },
  DocumentDrive_ListenerFilter: {
    documentType: {},
    documentId: {},
    scope: {},
    branch: {}
  },
  DocumentDrive_Listener: {
    get filter() {
      return {
        __fields: typesTree.DocumentDrive_ListenerFilter
      };
    },
    callInfo: {}
  },
  DocumentDriveLocalState: {
    get listeners() {
      return {
        __fields: typesTree.DocumentDrive_Listener
      };
    },
    triggers: {}
  },
  AtlasGroundingState: {
    parent: {},
    globalTags: {},
    references: {},
    originalContextData: {},
    provenance: {}
  },
  Query: {
    _service: {}
  }
};
let verbose = false;
let headers = {};
let url = "http://localhost:4001/atlas-grounding";
let retryConfig = {
  max: 0,
  before: void 0,
  waitBeforeRetry: 0
};
let responseListeners = [];
let apiEndpoint = (0, import_endpoint.getApiEndpointCreator)({
  getClient: () => ({ url, headers, retryConfig }),
  responseListeners,
  maxAge: 3e4,
  verbose,
  typesTree,
  formatGraphQL
});
const client = {
  addResponseListener: (listener) => responseListeners.push(
    listener
  ),
  setHeader: (key, value) => {
    headers[key] = value;
  },
  setHeaders: (newHeaders) => {
    headers = newHeaders;
  },
  setRetryConfig: (options) => {
    if (!Number.isInteger(options.max) || options.max < 0) {
      throw new Error("retryOptions.max should be a non-negative integer");
    }
    retryConfig = {
      max: options.max,
      waitBeforeRetry: options.waitBeforeRetry,
      before: options.before
    };
  },
  setUrl: (_url) => url = _url,
  queries: {
    _service: apiEndpoint("query", "_service")
  },
  mutations: {
    AtlasGrounding_createDocument: apiEndpoint("mutation", "AtlasGrounding_createDocument"),
    AtlasGrounding_setGroundingName: apiEndpoint("mutation", "AtlasGrounding_setGroundingName"),
    AtlasGrounding_setDocNumber: apiEndpoint("mutation", "AtlasGrounding_setDocNumber"),
    AtlasGrounding_setContent: apiEndpoint("mutation", "AtlasGrounding_setContent"),
    AtlasGrounding_setMasterStatus: apiEndpoint("mutation", "AtlasGrounding_setMasterStatus"),
    AtlasGrounding_setAtlasType: apiEndpoint("mutation", "AtlasGrounding_setAtlasType"),
    AtlasGrounding_setParent: apiEndpoint("mutation", "AtlasGrounding_setParent"),
    AtlasGrounding_addTags: apiEndpoint("mutation", "AtlasGrounding_addTags"),
    AtlasGrounding_removeTags: apiEndpoint("mutation", "AtlasGrounding_removeTags"),
    AtlasGrounding_addContextData: apiEndpoint("mutation", "AtlasGrounding_addContextData"),
    AtlasGrounding_removeContextData: apiEndpoint("mutation", "AtlasGrounding_removeContextData"),
    AtlasGrounding_setProvenance: apiEndpoint("mutation", "AtlasGrounding_setProvenance"),
    AtlasGrounding_setNotionId: apiEndpoint("mutation", "AtlasGrounding_setNotionId"),
    AtlasGrounding_addReference: apiEndpoint("mutation", "AtlasGrounding_addReference"),
    AtlasGrounding_removeReference: apiEndpoint("mutation", "AtlasGrounding_removeReference")
  }
};
var stdin_default = client;
