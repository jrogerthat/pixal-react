export const getAppStateReducer = () => {
  return (state, action) => {
  

    // const getData = async (action: any, isReadOnly: boolean) => {
    //   const baseDir = action.folderName;

    //   let roleData;
    //   let google_data: any;
    //   let txt_data: any;
    //   let artifact_types: any;
    //   let google_em: any;
    //   let google_comms: any;
    //   let link_data: any;
    //   let views: any;
    //   let threadFil: any;
    //   let selectedActivity: any;
    //   let selectedArtifact: any;
    //   let newEntries = [...action.projectData.entries];
    //   let citationData = action.projectData.citations
    //     ? action.projectData.citations
    //     : [];
    //   let newTags = [...action.projectData.tags];

    //   const googleEnRequest = readProjectFile(baseDir, 'goog_em.json', null);
    //   const googleDataRequest = readProjectFile(baseDir, 'goog_doc_data.json', null);
    //   const googleCommsRequest = readProjectFile(baseDir, 'goog_comms.json', null);
    //   const txtDataRequest = readProjectFile(baseDir, 'text_data.json', null);
    //   const relDataRequest = readProjectFile(baseDir, 'roles.json', null);
    //   const artifactTypesRequest = readProjectFile(baseDir, 'artifactTypes.json', null);
    //   const linksRequest = readProjectFile(baseDir, 'links.json', null);
    //   const researchThreadsRequest = checkRtFile(baseDir);

    //   try {
    //     google_em = await googleEnRequest;
    //   } catch (e: any) {
    //     console.error('could not load google em file');
    //     google_em = null;
    //   }

    //   try {
    //     // google_data = await readProjectFile(baseDir, 'goog_data.json', null);
    //     google_data = await googleDataRequest;
    //   } catch (e: any) {
    //     console.error('could not load google data file');
    //   }

    //   try {
    //     google_comms = await googleCommsRequest;
    //     // console.log('yes to goog comments');
    //   } catch (e) {
    //     google_comms = null;
    //     console.error('could not load goog comments');
    //   }

    //   try {
    //     txt_data = await txtDataRequest
    //     // console.log('yes to txtData');
    //   } catch (e) {
    //     txt_data = null;
    //     console.error('could not load text data');
    //   }

    //   try {
    //     roleData = await relDataRequest;
    //     // console.log('yes to role data');
    //   } catch (e) {
    //     console.error('could not load role data');
    //   }

    //   try {
    //     artifact_types = await artifactTypesRequest;
    //     // console.log('yes to artifact types data');
    //   } catch (e) {
    //     artifact_types = null;
    //     console.error('could not load artifact types');
    //   }

    //   try {
    //     link_data = await linksRequest;
    //     console.log('yes to linkData', baseDir);
    //   } catch (e) {
    //     link_data = null;
    //     console.error('could not load linkData');
    //   }

    //   try {
    //     newEntries = action.projectData.entries.map((e, i) => {
    //       let actOb = {};
    //       actOb.activity_uid = e.activity_uid;
    //       actOb.date = e.date;
    //       actOb.description = e.description;
    //       actOb.month = e.month;
    //       actOb.tags = e.tags;
    //       actOb.title = e.title;
    //       actOb.urls = e.urls;
    //       actOb.year = e.year;
    //       actOb.index = i;
    //       actOb.isPrivate = e.isPrivate ? e.isPrivate : false;
    //       actOb.files = e.files.map((ef) => {
    //         if (ef.fileType === 'gdoc') {
    //           // ef.artifactType = 'notes'
    //           ef.emphasized = google_em ? google_em[ef.fileId] : [];
    //           ef.comments = google_comms ? google_comms[ef.fileId] : [];
    //         }
    //         // else if(ef.fileType === 'pdf'){
    //         //   ef.artifactType = 'related work';
    //         // }
    //         // else if(ef.title.includes('.png')){
    //         //   ef.artifactType = 'sketch';
    //         // }

    //         // else if(ef.title.includes('https:/')){
    //         //   ef.artifactType = 'link';
    //         // }
    //         // else if(ef.fileType === 'txt'){
    //         //   ef.artifactType = 'transcript';
    //         //           // if(j < 2){

    //         //   const file = readSync(`${baseDir}/${ef.title}`)

    //         //   retext()
    //         //     .use(retextPos) // Make sure to use `retext-pos` before `retext-keywords`.
    //         //     .use(retextKeywords)
    //         //     .process(file)
    //         //     .then((file) => {

    //         //       ef.keywords = file.data.keywords;
    //         //       ef.keyPhrases = file.data.keyphrases;
    //         //     // file.data.keywords.forEach((keyword) => {
    //         //     //
    //         //     // })

    //         // //     file.data.keyphrases.forEach((phrase) => {
           
    //         // //     })
    //         //   })
    //         // }
    //         // else if(ef.fileType === 'eml'){
    //         //   ef.artifactType = 'correspondence'
    //         // }
    //         // else if(ef.fileType === 'csv' || ef.fileType === 'phy' || ef.fileType === 'htm'){
    //         //   ef.artifactType = 'data'
    //         // }else if(ef.fileType === 'gif' || ef.fileType === 'jpg'){
    //         //   ef.artifactType = 'tool artifact'
    //         // }
    //         // else if(ef.title.includes('Screen ')){
    //         //   ef.artifactType = 'tool artifact';
    //         // }
    //         ef.artifactType = ef.artifactType ? ef.artifactType : '';
    //         return ef;
    //       });
    //       // }

    //       return actOb;
    //     });

    //     newEntries = newEntries.sort(
    //       (a, b) =>
    //         // (reversedOrder ? -1 : +1) *
    //         Number(new Date(a.date)) - Number(new Date(b.date))
    //     );
    //   } catch (e) {
    //     console.error('could not reformat entries', e);
    //     return e;
    //   }

    //   try {
    //     newTags = newTags.map((t) => {
    //       let newT = {};
    //       newT.title = t.title;
    //       newT.color = t.color;
    //       newT.date = t.date;
    //       // newT.matches = t.matches.map(m => m.activity_uid);
    //       return newT;
    //     });
    //   } catch (e) {
    //     console.log('error with tags?');
    //   }

    //   const research_threads = await researchThreadsRequest;

    //   if (isReadOnly) {
    //     views = queryString.parse(location.search);

    //     if (Object.keys(views).length > 0) {
    //       if (views.granularity === 'thread') {
    //         let thisThread = research_threads.research_threads.filter(
    //           (f) => f.rt_id === views.id
    //         )[0];
    //         threadFil = {
    //           title: thisThread.title,
    //           rtId: views.id,
    //           rtIndex: research_threads.research_threads
    //             .map((rt: any) => rt.rt_id)
    //             .indexOf(views.id),
    //           key: thisThread.evidence.map((m: any) => m.activityTitle),
    //         };
    //       } else if (views.granularity === 'activity') {
    //         selectedActivity = views.id;
    //       } else if (views.granularity === 'artifact') {
    //         const activityTest = newEntries.filter((e) => {
        
    //           const test = e.files.length > 0 ? e.files.filter((f) => f.artifact_uid === views.id || f.fileId === views.id) : [];
          
    //           return test.length > 0;
    //         })[0];

    //         const artIn = activityTest ? activityTest.files
    //           .map((m) => m.artifact_uid)
    //           .indexOf(views.id) : null;

    //         selectedArtifact = {
    //           activity: activityTest,
    //           artifactIndex: artIn,
    //         };
    //       }
    //     }
    //   }
    //   const newProjectData = {
    //     entries: newEntries,
    //     roles: roleData,
    //     citations: citationData,
    //     tags: newTags,
    //     // citations: action.projectData.citations,
    //     date: action.projectData.date,
    //     description: action.projectData.description,
    //     title: action.projectData.title,
    //     eventArray: action.projectData.eventArray
    //       ? action.projectData.eventArray
    //       : [],
    //   };

    //   return {
    //     folderPath: action.folderName,
    //     projectData: newProjectData,
    //     filteredActivities: newProjectData.entries,
    //     isReadOnly: isReadOnly,
    //     googleData: google_data,
    //     txtData: txt_data,
    //     researchThreads: research_threads,
    //     filterTags: [],
    //     filterType: null,
    //     filterDates: [null, null],
    //     filterRT: threadFil,
    //     filterQuery: null,
    //     query: null,
    //     linkData: link_data,
    //     hopArray: [],
    //     goBackView: 'overview',
    //     viewParams: views,
    //     artifactTypes: artifact_types,
    //     selectedActivityURL: selectedActivity,
    //     selectedArtifact: selectedArtifact,
    //     threadTypeFilterArray: [
    //       { type: 'activity', show: true },
    //       { type: 'artifact', show: true },
    //       { type: 'fragment', show: true },
    //       { type: 'tags', show: true },
    //     ],
    //     allRTs: [
    //       {
    //         title: 'UI and Design',
    //         id: '22fc1832-852c-43ac-9f2a-7cc057fdcd97',
    //         color: '#1340a8',
    //       },
    //       {
    //         title: 'Research Thread Concept',
    //         id: 'b973c840-f26c-4a21-99b3-b93e411d659c',
    //         color: '#84309b',
    //       },
    //     ],
        
    //   };
    // };

    switch (action.type) {
      case 'SET_DATA': {
        // loading a project requires waiting for files to load over the network
        // the simplest way to handle this is to handle this in an async function,
        // and dispatch a new message to save the project data when it is ready
        // getData(action, isReadOnly).then(data => action.dispatch({ type: 'SAVE_DATA', data }));
        return state;
      }
      case 'SAVE_DATA': {
  
        return action.data;
      }

      case 'TEST' : {
        console.log('THIS IS A TEST');
        return {...state, testParam: 'test'}
      }
   
   

      case 'HOVER_OVER_ACTIVITY': {
        return {
          ...state,
          hoverActivity: action.hoverActivity,
        };
      }

      default: {
        console.log("Can't handle:", action);
        return state;
      }
    }
  };
};