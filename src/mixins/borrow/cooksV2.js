import { mapGetters } from "vuex";

export default {
  data() {
    return {
      defaultTokenAddress: "0x0000000000000000000000000000000000000000",
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      signer: "getSigner",
    }),
  },
  methods: {
  },
};
