const copy = {
  draft: true,
  experiment: {
    shapes: ["Ring", "Cross", "Diamond", "Bars"],
    sampleLabel: "Current sample xₜ",
    estimateLabel: "Clean estimate E[x₀|xₜ]",
    posteriorHint:
      "Percentages are posterior probabilities only within this four-shape toy model. Pixel display is clipped; calculation values are not.",
    noiseStep: "Noise step (changing resets the experiment)",
    reverseStep: "Reverse one step",
    finish: "Compute to the end",
    newSeed: "New seed",
    startFromNoise: "Start from noise only",
    excludeSource: "Exclude source from prior",
    stepsLeft: "Steps left",
    signalFraction: "Signal fraction ᾱ",
    sourceShape: "Source shape",
    sourceLabel: "Forward source (not passed to reverse process)",
    caption:
      "Forward: xₜ = √ᾱ x₀ + √(1−ᾱ) ε. Reverse: estimate a clean sample from the current sample, then apply a deterministic DDIM step. The reverse step receives neither the source shape nor its original noise.",
    modelTitle: "What does this model know?",
    modelBody:
      "No neural network is trained in this draft. It computes the exact posterior mean under a uniform prior over four fixed shapes and Gaussian corruption. Real diffusion models learn a denoiser from data. This model cannot generate new objects, text prompts or photos; it depends on its specified prior. Starting from noise approximates the terminal distribution.",
  },
  recap: {
    lessons: [
      "A reverse process uses the current sample and its prior, not the hidden original.",
      "Changing the prior can change the reconstruction for the same noisy input.",
      "This finite analytical model illustrates denoising; it does not train a neural network.",
    ],
  },
  tour: {
    intro: "Add noise, then investigate how a prior guides reverse steps.",
    stages: {
      experiment: {
        compare:
          "The left panel is the current noisy sample. The right panel estimates a clean sample from the allowed shapes.",
        noise: "Raise the noise. This restarts the forward experiment at the chosen step.",
        step: "Take one real reverse step. The original image and original noise are not passed to this calculation.",
        prior:
          "Exclude the source shape, then repeat. More steps do not restore knowledge missing from this prior.",
        finish: "Compute the remaining reverse steps and inspect which allowed shape remains.",
      },
    },
  },
  study: {
    topics: {
      visual: "Start visually",
      foundations: "Mathematical foundations",
      practice: "Build and sample",
    },
    notes: {
      "hf-ddim":
        "How DDIM updates samples from denoising predictions; this lab substitutes an analytical four-shape posterior for a trained network.",
      "welch-diffusion":
        "Start with a visual account of image generation. Its text/video models go beyond this lab’s four-shape prior.",
      "hf-diffusion-video":
        "Watch a notebook walkthrough linked by the Hugging Face course. Connect the lab’s noise and reverse-step controls to a trained denoiser.",
      "diffusion-tutorial":
        "Follow the equations from forward corruption to reverse sampling; a deeper mathematical next step after the lab.",
      "ddpm-paper":
        "Read the original DDPM formulation to distinguish the fixed forward process from the learned reverse process.",
      "ddim-paper":
        "Read the deterministic sampling construction behind this lab’s reverse update; its denoiser here is analytical, not a trained network.",
      "hf-diffusion-course":
        "Work through course notebooks to train a real diffusion model; unlike this lab, this requires a Python environment.",
      "annotated-diffusion":
        "Trace the PyTorch implementation from noise schedules through U-Net training and sampling. Best after the introductory material.",
      "udl-book":
        "Open the free book on the author’s site and find the diffusion models chapter. Requires mathematics; compare the lab’s analytic denoising with a trained model’s noise prediction.",
    },
  },
};
export default copy;
