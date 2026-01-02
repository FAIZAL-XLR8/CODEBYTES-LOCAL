const json = {
  title: "Add Two Numbers",
  description: "Write a program that takes two integers and outputs their sum.",
  difficulty: "easy",

  tags: "array",

  visibleTestCases: [
    {
      input: "2 3",
      output: "5",
      explanation: "2 + 3 equals 5",
    },
    {
      input: "-1 5",
      output: "4",
      explanation: "-1 + 5 equals 4",
    },
  ],

  hiddenTestCases: [
    {
      input: "10 20",
      output: "30",
    },
    {
      input: "100 250",
      output: "350",
    },
  ],

  startCode: [
    {
      language: "C++",
      boilerCode:
        "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  // Read input and print sum\n}",
    },
    {
      language: "Java",
      boilerCode:
        "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Read input and print sum\n  }\n}",
    },
    {
      language: "JavaScript",
      boilerCode:
        "const readline = require('readline');\n\n// Complete input handling here",
    },
  ],

  referenceSolution: [
    {
      language: "C++",
      solutionCode:
        "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b;\n  return 0;\n}",
    },
    {
      language: "Java",
      solutionCode:
        "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    int sum = a + b;\n    System.out.println(sum);\n  }\n}",
    },
    {
      language: "JavaScript",
      solutionCode:
        "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(a + b);",
    },
  ],
};
/*{
  "title": "Add Two Numbers",
  "description": "Write a program that takes two integers and outputs their sum.",
  "difficulty": "easy",
  "tags": "array",

  "visibleTestCase": [
    {
      "input": "2 3",
      "output": "5",
      "explaination": "2 + 3 equals 5"
    },
    {
      "input": "-1 5",
      "output": "4",
      "explaination": "-1 + 5 equals 4"
    }
  ],

  "hiddenTestCase": [
    {
      "input": "10 20",
      "output": "30"
    },
    {
      "input": "100 250",
      "output": "350"
    }
  ],

  "startCode": [
    {
      "language": "C++",
      "boilerCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  // Read input and print sum\n}"
    },
    {
      "language": "Java",
      "boilerCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Read input and print sum\n  }\n}"
    },
    {
      "language": "JavaScript",
      "boilerCode": "const readline = require('readline');\n\n// Complete input handling here"
    }
  ],

  "referenceSolution": [
    {
      "language": "C++",
      "solutionCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b;\n  return 0;\n}"
    },
    {
      "language": "Java",
      "solutionCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    int sum = a + b;\n    System.out.println(sum);\n  }\n}"
    },
    {
      "language": "JavaScript",
      "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(a + b);"
    }
  ]
}
*/
