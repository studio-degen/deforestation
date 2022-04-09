// rules[0] = {
//   X: "X",
//   F: "F",
//   X1: "F[+X]F[-X]+X",
//   X2: "F[+X][-X]FX",
//   X3: "F-[[X]+X]+F[+FX]-X",
//   F1: "FF",
// };
// function recurTree(x, y, l, a, s) {
//   resetMatrix();

//   push();
//   translate(x, y);
//   noStroke();
//   for (let i = 0; i < s.length; i++) {
//     let current = s.charAt(i);
//     if (current == "F") {
//       fill(treeBranch);
//       rect(0, 0, 3, -l);
//       translate(0, -l, 1);
//     } else if (current == "X") {
//       // fill(treeFoliage);
//       // ellipse(0, -l, 30);
//       fill(treeBranch);
//       rect(0, 0, 3, -l);
//       translate(0, -l, 1);
//     } else if (current == "+") {
//       rotate(a);
//     } else if (current == "-") {
//       rotate(-a);
//     } else if (current == "[") {
//       push();
//     } else if (current == "]") {
//       pop();
//     }
//   }
//   translate(0, 0);
//   pop();
// }

// function generateNewSentence(x, y, c, cmax, l, a, s, ls) {
//   console.log(x, y, c, cmax, l, a, s, ls);
//   while (c < cmax) {
//     l *= 0.5;
//     let nextSentence = "";
//     for (let i = 0; i < s.length; i++) {
//       let current = s.charAt(i);
//       let found = false;
//       for (let j = 0; j < rules.length; j++) {
//         if (current == rules[0].X) {
//           found = true;
//           if (ls == 1) nextSentence += rules[0].X1;
//           else if (ls == 2) nextSentence += rules[0].X2;
//           else nextSentence += rules[0].X3;
//           break;
//         } else if (current == rules[0].F) {
//           found = true;
//           nextSentence += rules[0].F1;
//           break;
//         }
//       }
//       if (!found) {
//         nextSentence += current;
//       }
//     }
//     s = nextSentence;
//     // createP(s);
//     recurTree(x, y, l, a, s);
//     c++;
//   }
// }
