<script lang="ts">
    import { Stepper, Step } from '@skeletonlabs/skeleton';
  </script>
  <svelte:head>
    <title>Software | Nathanael Sheehan</title>
    <meta name="robots" content="noindex nofollow" />
    <html lang="en" />
  </svelte:head>
  <h1>Research Software</h1>
  <Stepper stepTerm='Project'>
    <Step>
      <svelte:fragment slot="header">GIGWORK.city</svelte:fragment>
      <img
        src="/FM74HVOXwAEAte_.gif"
        style="
          display: block;
          margin-left: auto;
          margin-right: auto;
          width: 50%;
          margin-bottom: 2%;
        "
        alt=""
      />
  
      <p>
        The work in the gig economy is characterised by opacity and alienation, digital platforms effectively hiding from view the intensive human labour that enables our daily instant gratifications. For platform food couriers, this hidden work is concealed behind a dot moving on and across a map, deprived of identity or history. At a time when the possibilities for social bonds and empathy with workers are often denied to us, this web project gathers courier stories from three European cities to show what lies behind the moving dot. Using graphic illustrations, GIS data and audio diaries, this interactive multimedia platform aims to problematise the discourses of flexibility, independence and entrepreneurship surrounding gig work. This platform is part of the research project Doing Gig Work, which studies the management, solidarity and resistance of platform food couriers in Manchester (UK), Cluj (Romania) and Lyon (France).
      </p>
      <!-- <img
        src="jerome2.png"
        style="
          display: block;
          margin-left: auto;
          margin-right: auto;
          width: 50%;
        "
        alt=""
      /> -->
      <p><a href="https://github.com/gigwork/Gigwork-Stories"><i>repo </i></a></p>
      <a href="https://gigwork.city/">website</a>
    </Step>
    <!-- ... -->
    <Step>
      <svelte:fragment slot="header">     <img
      src="129973263-5fc74ae3-ed17-4155-9a8c-7f382f7796cc.png"
      style="
        display: block;
        margin-left: 0%;
        width: 8%;
        margin-bottom: 2%;
        height: 10%;
      "
      alt=""
    /></svelte:fragment>
  
      <img
        src="128907563-4aa95b30-a98d-4fbc-9275-97e0b30dd227.gif"
        style="
          display: block;
          margin-left: auto;
          margin-right: auto;
          width: 50%;
          margin-top:-10%;
        "
        alt=""
      />
  
      <p>
        abstr provides an R interface to the A/B Street transport system simulation and network editing software. It provides functions for converting origin-destination data, combined with data on buildings representing origin and destination locations, into .json files that can be directly imported into the A/B Street city simulation.
        See the formats page in the A/B Street documentation for details of the schema that the package outputs.
      </p>
 
      <p><a href="https://github.com/a-b-street/abstr"><i>repo </i></a></p>
      <a href="https://a-b-street.github.io/abstr/">website</a>
    </Step>
    <Step>
      <svelte:fragment slot="header"> River Sentiment Dashboard</svelte:fragment>
  
  
      <p>
        People talk about rivers online: from complaints about pollution to celebrations of wildlife, rivers provoke passionate social media comments. When people express their feelings about rivers on Twitter, we get a glimpse of how nature affects human wellbeing. The River Sentiment Dashboard displays social media sentiment alongside data about the ecological status of more than 450 rivers in the Thames basin in England. This prototype has been developed by Oxford University and Thames21.</p>
 
      <p><a href="https://github.com/Digital-Water-Publics/Thames21-Socio-Ecological-Dashboard"><i>repo </i></a></p>
      <a href="https://thames21ox.web.app/">website</a>
    </Step>
    <Step>
      <svelte:fragment slot="header">eaCatcher</svelte:fragment>

  
      <p>
        The eaCatcheR R package provides an interface to data from the environment.data.gov.uk catchment planner, which is a resource for various spatial and ecological datasets on waterbodies in England. The package contains three main functions: get_wb_rnag(), get_wb_classification(), and get_wb_sf(), each of which allows you to access data based on geography type (e.g. RBD, MC, OC) and the name of the geography you wish to search.
      </p>
 
      <p><a href="https://github.com/natesheehan/eaCatcheR"><i>repo </i></a></p>
      <a href="https://natesheehan.github.io/eaCatcheR/">website</a>
    </Step>
    <Step>
      <svelte:fragment slot="header">dimaqdata</svelte:fragment>

  
      <p>
        This package contains ten datasets provided by the members of the Data Integration Task Force, a multi-disciplinary group of experts established as part of the recommendations from the first meeting of the WHO Global Platform for Air Quality in Geneva, January 2014.

        who_world_map: sf WHO world map shapefile
        
        ground_monitor: sf Yearly global ground monitor station
        
        population_weighted_concentrations: df Yearly population weighted pm2.5 concentrations by country or WHO region
        
        global_exceed: df Yearly exceedances by country at 10,15,20,25 spatial scale
        
        pred_2011: sf 2011 Global Predictions spatial resolution (0.1° × 0.1°)
        
        pred_2012: sf 2012 Global Predictions spatial resolution (0.1° × 0.1°)
        
        pred_2013: sf 2013 Global Predictions spatial resolution (0.1° × 0.1°)
        
        pred_2014: sf 2014 Global Predictions spatial resolution (0.1° × 0.1°)
        
        pred_2015: sf 2015 Global Predictions spatial resolution (0.1° × 0.1°)
        
        pred_2016: sf 2016 Global Predictions spatial resolution (0.1° × 0.1°)
       </p>
 
      <p><a href="https://github.com/environmental-intelligence-exeter/dimaqdata"><i>repo </i></a></p>
      <a href="https://environmental-intelligence-exeter.github.io/dimaqdata//">website</a>
    </Step>
    <!-- ... -->
  </Stepper>
  