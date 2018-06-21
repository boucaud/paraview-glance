import samples from 'paraview-glance/src/samples';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';

export default {
  name: 'Landing',
  components: {
    DragAndDrop,
  },
  data() {
    return {
      samples,
    };
  },
  methods: {
    openSample(sample) {
      const urls = [];
      const names = [];
      for (let i = 0; i < sample.datasets.length; ++i) {
        console.log(sample.datasets[i]);
        urls.push(sample.datasets[i].url);
        names.push(sample.datasets[i].name);
      }
      this.$emit('open-urls', urls, names);
    },
  },
};
