<!-- Multiple H1 elements with the mouseover effect -->
<script lang="ts">
    import { onMount } from "svelte";
  
    const emails = [
      "Greetings, and welcome to the digital archive of Nathanael Sheehan, PhD candidate at the University of Exeter, specializing in the field of environmental intelligence. My research endeavors lie at the intersection of genomics, environmental studies, and the philosophy of open science. My current work delves into the complexities of data analysis in the post-genomic age, with a specific focus on the geopolitical and philosophical implications of open science. Utilizing a multi-disciplinary approach drawing from fields such as philosophy of science, computer science, and science and technology studies, my doctoral thesis aims to examine the role of cooperative work and digital technologies in the diffusion of knowledge. My research is grounded in the case of genomic surveillance, where I explore the cultural and historical elements that shape the dissemination and preservation of data in times of crisis. If you wish to engage with me on this exciting academic pursuit, please do not hesitate to contact me at NS651@EXETER.AC.UK."
    ];
  
    const alias = [
        "asdjklas;jdsa;l",
        "khjdaslkdhaskl",
        "hsadkjhaskljdhkas"
    ]
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let intervals: NodeJS.Timeout[] = [];
  
    onMount(() => {
      const handleMouseOver = (index: number) => (event: MouseEvent) => {
        const h1 = event.target as HTMLHeadingElement;
        let iteration = 0;
  
        clearInterval(intervals[index]);
  
        intervals[index] = setInterval(() => {
          h1.innerText = h1.innerText
            .split("")
            .map((letter, i) => {
              if (i < iteration) {
                return h1.dataset.value![i];
              }
              return letters[Math.floor(Math.random() * 26)];
            })
            .join("");
  
          if (iteration >= h1.dataset.value!.length) {
            clearInterval(intervals[index]);
          }
  
          iteration += 1 / 2;
        }, 30);
      };
  
      emails.forEach((email, index) => {
        const h1 = document.querySelector(`h1[data-value="${email}"]`);
        intervals[index] = null;
  
        if (h1) {
          h1.addEventListener("mouseover", handleMouseOver(index));
        }
      });
  
      return () => {
        intervals.forEach((interval, index) => {
          clearInterval(interval);
          const h1 = document.querySelector(`h1[data-value="${emails[index]}"]`);
          if (h1) {
            h1.removeEventListener("mouseover", handleMouseOver(index));
          }
        });
      };
    });
  </script>
  

    <h1 class="p-5 break-words" data-value={emails}>{"ACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCTACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCTACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCTACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCTACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCTACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCTACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCTACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCTACGTTAGCAGGCTTCGACGAGTCCGGGAGGCTGACTCAGGTGACTGTTACAGCTTGATGGTGACGTAGGTTTGTTACGAGCTGTAGACTCTGGTTAGACCTATCAGTTCGATGTTGTCGAGGTCCCTGCTGTAGACTCCGAGGACTAGTGACGAGTGAACTCAGGTGTCTTTGGTGACTAGATTTACAGGACTATGAGGGGCTGGAGGACCATGCTAAGGCTGGGTAGACATGTTGACGCT"}</h1>
