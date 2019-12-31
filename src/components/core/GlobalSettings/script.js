import GpuInformation from 'paraview-glance/src/components/widgets/GPUInformation';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import { Mutations } from 'paraview-glance/src/store/types';

const INTERACTION_STYLES_3D = [
  { text: 'Default', value: '3D' },
  { text: 'First Person', value: 'FirstPerson' },
];

const ORIENTATION_PRESETS = [
  { text: 'XYZ', value: 'default' },
  { text: 'LPS', value: 'lps' },
];

const AXIS_TYPES = [
  { text: 'Arrows', value: 'arrow' },
  { text: 'Cube', value: 'cube' },
];

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function getDefaultViews(pxm) {
  return pxm.getViews().filter((v) => v.getName() === 'default');
}

// ----------------------------------------------------------------------------

function getFirstPersonMovementSpeed(pxm) {
  const views = getDefaultViews(pxm);
  for (let i = 0; i < views.length; ++i) {
    const interactorStyle = views[i].getInteractorStyle3D();
    const manipulators = interactorStyle.getKeyboardManipulators();
    for (let j = 0; j < manipulators.length; ++j) {
      const manip = manipulators[j];
      if (manip.getMovementSpeed) {
        if (manip.getMovementSpeed() === null) {
          // Set the renderer and reset the movement speed
          manip.setRenderer(views[i].getRenderer());
          manip.resetMovementSpeed();
        }
        return manip.getMovementSpeed();
      }
    }
  }
  return undefined;
}

// ----------------------------------------------------------------------------

function setFirstPersonMovementSpeed(pxm, speed) {
  getDefaultViews(pxm).forEach((view) => {
    const interactorStyle = view.getInteractorStyle3D();
    const manipulators = interactorStyle.getKeyboardManipulators();
    manipulators.forEach((manipulator) => {
      if (manipulator.setMovementSpeed) {
        manipulator.setMovementSpeed(speed);
      }
    });
  });
}

// ----------------------------------------------------------------------------

function setOrientationAxesVisible(visible) {
  this.proxyManager.getViews().forEach((view) => {
    view.setOrientationAxesVisibility(visible);
    view.renderLater();
  });
}

// ----------------------------------------------------------------------------

function setAxisType(type) {
  this.proxyManager.getViews().forEach((view) => {
    view.setOrientationAxesType(type);
  });
  // will call view.renderLater()
  this.setPresetToOrientationAxes(this.orientationPreset);
}

// ----------------------------------------------------------------------------

function setPresetToOrientationAxes(presetName) {
  this.proxyManager.getViews().forEach((view) => {
    view.setPresetToOrientationAxes(presetName);
    view.renderLater();
  });
}

// ----------------------------------------------------------------------------

function setAnnotationOpacity(opacity) {
  this.proxyManager
    .getViews()
    .forEach((view) => view.setAnnotationOpacity(opacity));
}

// ----------------------------------------------------------------------------

function pushGlobalSettings() {
  this.setOrientationAxesVisible(this.orientationAxis);
  this.setAnnotationOpacity(this.annotationOpacity);
}

// ----------------------------------------------------------------------------

function getViewForVR() {
  const views = this.proxyManager.getViews();
  for (let i = 0; i < views.length; i++) {
    if (views[i].getProxyName() === 'View3D') {
      return views[i];
    }
  }
  return null;
}

// ----------------------------------------------------------------------------

export default {
  name: 'GlobalSettings',
  components: {
    PalettePicker,
    GpuInformation,
  },
  data() {
    return {
      palette: BACKGROUND,
      interactionStyles3D: INTERACTION_STYLES_3D,
      annotationOpacity: 1,
      orientationPresets: ORIENTATION_PRESETS,
      axisTypes: AXIS_TYPES,
      vrEnabled: false,
      physicalScale: 1,
      basePhysicalScale: 1,
    };
  },
  computed: {
    proxyManager() {
      return this.$store.state.proxyManager;
    },
    backgroundColor: {
      get() {
        return this.$store.state.global.backgroundColor;
      },
      set(color) {
        this.$store.commit(Mutations.GLOBAL_BG, color);
      },
    },
    interactionStyle3D: {
      get() {
        return this.$store.state.global.interactionStyle3D;
      },
      set(style) {
        this.$store.commit(Mutations.GLOBAL_INTERACTION_STYLE_3D, style);
      },
    },
    firstPersonInteraction() {
      return this.$store.state.global.interactionStyle3D === 'FirstPerson';
    },
    firstPersonMovementSpeed: {
      get() {
        return getFirstPersonMovementSpeed(this.proxyManager);
      },
      set(speed) {
        setFirstPersonMovementSpeed(this.proxyManager, speed);
      },
    },
    orientationAxis: {
      get() {
        return this.$store.state.global.orientationAxis;
      },
      set(flag) {
        this.$store.commit(Mutations.GLOBAL_ORIENT_AXIS, flag);
      },
    },
    orientationPreset: {
      get() {
        return this.$store.state.global.orientationPreset;
      },
      set(preset) {
        this.$store.commit(Mutations.GLOBAL_ORIENT_PRESET, preset);
      },
    },
    axisType: {
      get() {
        return this.$store.state.global.axisType;
      },
      set(axisType) {
        this.$store.commit(Mutations.GLOBAL_AXIS_TYPE, axisType);
      },
    },
    maxTextureLODSize: {
      get() {
        return this.$store.state.global.maxTextureLODSize;
      },
      set(size) {
        this.$store.commit(Mutations.GLOBAL_MAX_TEXTURE_LOD_SIZE, size);
      },
    },
  },
  watch: {
    orientationAxis: setOrientationAxesVisible,
    orientationPreset: setPresetToOrientationAxes,
    annotationOpacity: setAnnotationOpacity,
    axisType: setAxisType,
    physicalScale() {
      const view = this.getViewForVR();
      if (view) {
        view
          .getCamera()
          .setPhysicalScale(
            this.basePhysicalScale / Number(this.physicalScale)
          );
      }
    },
  },
  methods: {
    hasVR() {
      const view = this.getViewForVR();
      return view && !!view.getOpenglRenderWindow().getVrDisplay();
    },
    setAxisType,
    setOrientationAxesVisible,
    setAnnotationOpacity,
    setPresetToOrientationAxes,
    pushGlobalSettings,
    getViewForVR,
    toggleVR(vr) {
      const view = this.getViewForVR();
      if (view) {
        const camera = view.getCamera();
        const renderer = view.getRenderer();
        const glRenderWindow = view.getOpenglRenderWindow();
        if (vr) {
          view.setOrientationAxesVisibility(false);
          renderer.resetCamera();
          this.basePhysicalScale = camera.getPhysicalScale();
          this.physicalScale = 1;

          // ------------------------------------------------------------------
          // Reorient physical space
          // ------------------------------------------------------------------
          const unit = (v) => (v > 0 ? 1 : -1);
          const north = camera.getDirectionOfProjection();
          const northMax = Math.max(...north.map(Math.abs));
          camera.setPhysicalViewNorth(
            north.map((v) => (Math.abs(v) === northMax ? unit(v) : 0))
          );

          const up = camera.getViewUp();
          const upMax = Math.max(...up.map(Math.abs));
          camera.setPhysicalViewUp(
            up.map((v) => (Math.abs(v) === upMax ? unit(v) : 0))
          );
          // ------------------------------------------------------------------

          // Start VR finally
          glRenderWindow.startVR();
        } else {
          glRenderWindow.stopVR();
          view.setOrientationAxesVisibility(this.orientationAxis);
        }
      }
    },
  },
  created() {
    this.subscription = this.proxyManager.onProxyRegistrationChange(() => {
      this.pushGlobalSettings();
    });
  },
  beforeDestroy() {
    this.subscription.unsubscribe();
  },
};
