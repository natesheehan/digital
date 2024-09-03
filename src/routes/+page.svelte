<!-- Multiple H1 elements with the mouseover effect -->

<script lang="ts">
    import { onMount } from "svelte";
  
    const emails = [
  "nathanaelsheehan@gmail.com"  
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

<svelte:head>
  <title>Bio | Nathanael Sheehan</title>
</svelte:head>

<img src="me.png" style="float: right;">


<p>
  I dance through city skylines, tracing the contours of rooftops like a needle on vinyl, leaving behind the echoes of forgotten tunes.</p>
  <p>
    I invite pigeons to join me in my quest to teach the stories that live between the cracks of the pavement.
  </p>
  <p>
    I befriend stray cats with a purr of understanding and can silence a barking dog with a single gaze. 
  </p>
  <p>
    I survived on daydreams and starlight long before I ever touched a drop of caffeine. 
  </p>
  <p>I climb hills with the enthusiasm of a mountain goat and descend with the reckless abandon of a child on a sled.</p>
  <p>
    I’ve learned the art of borrowing—recipes, jokes, and the best pieces of advice from people who never knew I was listening. 
  </p>
<h1> Get In Contact</h1>


    <h1 class="p-5 break-words" data-value={emails}>{"*%^%$^*£$%£$*%£$*%£$*£$%^^"}</h1>

    