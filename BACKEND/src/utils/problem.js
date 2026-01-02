const problems = [
  // ==================== EASY PROBLEMS ====================
  {
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
      },
      {
        "input": "-50 -30",
        "output": "-80"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  // Read input and print sum\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Read input and print sum\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\n// Complete the solution here"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b;\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    System.out.println(a + b);\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(a + b);"
      }
    ]
  },

  {
    "title": "Find Maximum in Array",
    "description": "Given an array of integers, find and return the maximum element.",
    "difficulty": "easy",
    "tags": "array",
    "visibleTestCase": [
      {
        "input": "5\n1 5 3 9 2",
        "output": "9",
        "explaination": "The array is [1, 5, 3, 9, 2] and 9 is the largest element"
      },
      {
        "input": "3\n-10 -5 -20",
        "output": "-5",
        "explaination": "Among negative numbers, -5 is the maximum"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "6\n100 200 50 75 300 25",
        "output": "300"
      },
      {
        "input": "1\n42",
        "output": "42"
      },
      {
        "input": "4\n-1 -2 -3 -4",
        "output": "-1"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  int arr[n];\n  // Read array and find maximum\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // Read array and find maximum\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst arr = input[1].split(' ').map(Number);\n// Find and print maximum"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  int arr[n];\n  for(int i = 0; i < n; i++) cin >> arr[i];\n  int maxVal = arr[0];\n  for(int i = 1; i < n; i++) {\n    if(arr[i] > maxVal) maxVal = arr[i];\n  }\n  cout << maxVal;\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] arr = new int[n];\n    for(int i = 0; i < n; i++) arr[i] = sc.nextInt();\n    int max = arr[0];\n    for(int i = 1; i < n; i++) {\n      if(arr[i] > max) max = arr[i];\n    }\n    System.out.println(max);\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst arr = input[1].split(' ').map(Number);\nconst max = Math.max(...arr);\nconsole.log(max);"
      }
    ]
  },

  {
    "title": "Count Even Numbers",
    "description": "Given an array of integers, count how many numbers are even.",
    "difficulty": "easy",
    "tags": "array",
    "visibleTestCase": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "2",
        "explaination": "Numbers 2 and 4 are even, so count is 2"
      },
      {
        "input": "4\n10 15 20 25",
        "output": "2",
        "explaination": "Numbers 10 and 20 are even"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "6\n2 4 6 8 10 12",
        "output": "6"
      },
      {
        "input": "3\n1 3 5",
        "output": "0"
      },
      {
        "input": "5\n-2 -4 0 2 4",
        "output": "5"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  // Read array and count even numbers\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // Read array and count even numbers\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst arr = input[1].split(' ').map(Number);\n// Count and print even numbers"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  int count = 0;\n  for(int i = 0; i < n; i++) {\n    int num;\n    cin >> num;\n    if(num % 2 == 0) count++;\n  }\n  cout << count;\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int count = 0;\n    for(int i = 0; i < n; i++) {\n      int num = sc.nextInt();\n      if(num % 2 == 0) count++;\n    }\n    System.out.println(count);\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst arr = input[1].split(' ').map(Number);\nconst count = arr.filter(num => num % 2 === 0).length;\nconsole.log(count);"
      }
    ]
  },

  // ==================== MEDIUM PROBLEMS ====================
  {
    "title": "Two Sum Problem",
    "description": "Given an array of integers and a target sum, find two numbers that add up to the target. Return their indices (0-indexed) separated by space.",
    "difficulty": "medium",
    "tags": "array",
    "visibleTestCase": [
      {
        "input": "4 9\n2 7 11 15",
        "output": "0 1",
        "explaination": "arr[0] + arr[1] = 2 + 7 = 9, so indices are 0 and 1"
      },
      {
        "input": "3 6\n3 2 4",
        "output": "1 2",
        "explaination": "arr[1] + arr[2] = 2 + 4 = 6"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "5 10\n1 3 5 7 9",
        "output": "0 4"
      },
      {
        "input": "4 8\n1 2 3 5",
        "output": "2 3"
      },
      {
        "input": "6 15\n10 5 2 3 7 8",
        "output": "0 1"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n, target;\n  cin >> n >> target;\n  int arr[n];\n  // Read array and find two indices\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int target = sc.nextInt();\n    // Read array and find two indices\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, target] = input[0].split(' ').map(Number);\nconst arr = input[1].split(' ').map(Number);\n// Find and print two indices"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n, target;\n  cin >> n >> target;\n  int arr[n];\n  for(int i = 0; i < n; i++) cin >> arr[i];\n  for(int i = 0; i < n; i++) {\n    for(int j = i + 1; j < n; j++) {\n      if(arr[i] + arr[j] == target) {\n        cout << i << \" \" << j;\n        return 0;\n      }\n    }\n  }\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int target = sc.nextInt();\n    int[] arr = new int[n];\n    for(int i = 0; i < n; i++) arr[i] = sc.nextInt();\n    for(int i = 0; i < n; i++) {\n      for(int j = i + 1; j < n; j++) {\n        if(arr[i] + arr[j] == target) {\n          System.out.println(i + \" \" + j);\n          return;\n        }\n      }\n    }\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, target] = input[0].split(' ').map(Number);\nconst arr = input[1].split(' ').map(Number);\nfor(let i = 0; i < n; i++) {\n  for(let j = i + 1; j < n; j++) {\n    if(arr[i] + arr[j] === target) {\n      console.log(i + ' ' + j);\n      break;\n    }\n  }\n}"
      }
    ]
  },

  {
    "title": "Reverse Linked List",
    "description": "Given a singly linked list represented as space-separated integers, reverse it and print the reversed list.",
    "difficulty": "medium",
    "tags": "linkedList",
    "visibleTestCase": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "5 4 3 2 1",
        "explaination": "The list [1->2->3->4->5] becomes [5->4->3->2->1]"
      },
      {
        "input": "3\n10 20 30",
        "output": "30 20 10",
        "explaination": "The list [10->20->30] becomes [30->20->10]"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "1\n42",
        "output": "42"
      },
      {
        "input": "6\n1 2 3 4 5 6",
        "output": "6 5 4 3 2 1"
      },
      {
        "input": "4\n100 200 300 400",
        "output": "400 300 200 100"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> list(n);\n  // Read list and reverse it\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.Scanner;\nimport java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // Read list and reverse it\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst list = input[1].split(' ').map(Number);\n// Reverse and print list"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> list(n);\n  for(int i = 0; i < n; i++) cin >> list[i];\n  reverse(list.begin(), list.end());\n  for(int i = 0; i < n; i++) {\n    cout << list[i];\n    if(i < n-1) cout << \" \";\n  }\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.Scanner;\nimport java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    ArrayList<Integer> list = new ArrayList<>();\n    for(int i = 0; i < n; i++) list.add(sc.nextInt());\n    Collections.reverse(list);\n    for(int i = 0; i < n; i++) {\n      System.out.print(list.get(i));\n      if(i < n-1) System.out.print(\" \");\n    }\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst list = input[1].split(' ').map(Number);\nconst reversed = list.reverse();\nconsole.log(reversed.join(' '));"
      }
    ]
  },

  {
    "title": "Stock Buy and Sell",
    "description": "Given an array of stock prices where prices[i] is the price on day i, find the maximum profit you can achieve by buying on one day and selling on another day in the future. Return 0 if no profit is possible.",
    "difficulty": "medium",
    "tags": "array",
    "visibleTestCase": [
      {
        "input": "6\n7 1 5 3 6 4",
        "output": "5",
        "explaination": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5"
      },
      {
        "input": "5\n7 6 4 3 1",
        "output": "0",
        "explaination": "No profit possible as prices keep decreasing"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "4\n2 4 1 7",
        "output": "6"
      },
      {
        "input": "3\n3 3 3",
        "output": "0"
      },
      {
        "input": "5\n1 2 3 4 5",
        "output": "4"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  int prices[n];\n  // Read prices and calculate max profit\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // Read prices and calculate max profit\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst prices = input[1].split(' ').map(Number);\n// Calculate and print max profit"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  int prices[n];\n  for(int i = 0; i < n; i++) cin >> prices[i];\n  int minPrice = prices[0];\n  int maxProfit = 0;\n  for(int i = 1; i < n; i++) {\n    maxProfit = max(maxProfit, prices[i] - minPrice);\n    minPrice = min(minPrice, prices[i]);\n  }\n  cout << maxProfit;\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] prices = new int[n];\n    for(int i = 0; i < n; i++) prices[i] = sc.nextInt();\n    int minPrice = prices[0];\n    int maxProfit = 0;\n    for(int i = 1; i < n; i++) {\n      maxProfit = Math.max(maxProfit, prices[i] - minPrice);\n      minPrice = Math.min(minPrice, prices[i]);\n    }\n    System.out.println(maxProfit);\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst prices = input[1].split(' ').map(Number);\nlet minPrice = prices[0];\nlet maxProfit = 0;\nfor(let i = 1; i < n; i++) {\n  maxProfit = Math.max(maxProfit, prices[i] - minPrice);\n  minPrice = Math.min(minPrice, prices[i]);\n}\nconsole.log(maxProfit);"
      }
    ]
  },

  {
    "title": "Detect Cycle in Graph",
    "description": "Given an undirected graph with n vertices (0 to n-1) and a list of edges, determine if the graph contains a cycle. Print 'YES' if cycle exists, 'NO' otherwise.",
    "difficulty": "medium",
    "tags": "graph",
    "visibleTestCase": [
      {
        "input": "4 4\n0 1\n1 2\n2 3\n3 1",
        "output": "YES",
        "explaination": "There's a cycle: 1->2->3->1"
      },
      {
        "input": "3 2\n0 1\n1 2",
        "output": "NO",
        "explaination": "The graph is a simple chain with no cycles"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "5 5\n0 1\n1 2\n2 3\n3 4\n4 0",
        "output": "YES"
      },
      {
        "input": "4 3\n0 1\n0 2\n0 3",
        "output": "NO"
      },
      {
        "input": "3 3\n0 1\n1 2\n2 0",
        "output": "YES"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  int n, m;\n  cin >> n >> m;\n  vector<vector<int>> adj(n);\n  // Read edges and detect cycle\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int m = sc.nextInt();\n    // Read edges and detect cycle\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, m] = input[0].split(' ').map(Number);\nconst adj = Array.from({length: n}, () => []);\n// Read edges and detect cycle"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nbool dfs(int node, int parent, vector<vector<int>>& adj, vector<bool>& visited) {\n  visited[node] = true;\n  for(int neighbor : adj[node]) {\n    if(!visited[neighbor]) {\n      if(dfs(neighbor, node, adj, visited)) return true;\n    } else if(neighbor != parent) {\n      return true;\n    }\n  }\n  return false;\n}\n\nint main() {\n  int n, m;\n  cin >> n >> m;\n  vector<vector<int>> adj(n);\n  for(int i = 0; i < m; i++) {\n    int u, v;\n    cin >> u >> v;\n    adj[u].push_back(v);\n    adj[v].push_back(u);\n  }\n  vector<bool> visited(n, false);\n  for(int i = 0; i < n; i++) {\n    if(!visited[i]) {\n      if(dfs(i, -1, adj, visited)) {\n        cout << \"YES\";\n        return 0;\n      }\n    }\n  }\n  cout << \"NO\";\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.*;\n\npublic class Main {\n  static boolean dfs(int node, int parent, ArrayList<ArrayList<Integer>> adj, boolean[] visited) {\n    visited[node] = true;\n    for(int neighbor : adj.get(node)) {\n      if(!visited[neighbor]) {\n        if(dfs(neighbor, node, adj, visited)) return true;\n      } else if(neighbor != parent) {\n        return true;\n      }\n    }\n    return false;\n  }\n  \n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int m = sc.nextInt();\n    ArrayList<ArrayList<Integer>> adj = new ArrayList<>();\n    for(int i = 0; i < n; i++) adj.add(new ArrayList<>());\n    for(int i = 0; i < m; i++) {\n      int u = sc.nextInt();\n      int v = sc.nextInt();\n      adj.get(u).add(v);\n      adj.get(v).add(u);\n    }\n    boolean[] visited = new boolean[n];\n    for(int i = 0; i < n; i++) {\n      if(!visited[i]) {\n        if(dfs(i, -1, adj, visited)) {\n          System.out.println(\"YES\");\n          return;\n        }\n      }\n    }\n    System.out.println(\"NO\");\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, m] = input[0].split(' ').map(Number);\nconst adj = Array.from({length: n}, () => []);\nfor(let i = 1; i <= m; i++) {\n  const [u, v] = input[i].split(' ').map(Number);\n  adj[u].push(v);\n  adj[v].push(u);\n}\n\nfunction dfs(node, parent, visited) {\n  visited[node] = true;\n  for(let neighbor of adj[node]) {\n    if(!visited[neighbor]) {\n      if(dfs(neighbor, node, visited)) return true;\n    } else if(neighbor !== parent) {\n      return true;\n    }\n  }\n  return false;\n}\n\nconst visited = new Array(n).fill(false);\nfor(let i = 0; i < n; i++) {\n  if(!visited[i]) {\n    if(dfs(i, -1, visited)) {\n      console.log('YES');\n      process.exit();\n    }\n  }\n}\nconsole.log('NO');"
      }
    ]
  },

  // ==================== HARD PROBLEMS ====================
  {
    "title": "Longest Common Subsequence",
    "description": "Given two strings, find the length of their longest common subsequence. A subsequence is a sequence that appears in the same relative order but not necessarily contiguous.",
    "difficulty": "hard",
    "tags": "dp",
    "visibleTestCase": [
      {
        "input": "abcde\nace",
        "output": "3",
        "explaination": "The longest common subsequence is 'ace' with length 3"
      },
      {
        "input": "abc\ndef",
        "output": "0",
        "explaination": "No common subsequence exists"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "programming\ngaming",
        "output": "6"
      },
      {
        "input": "abcdefgh\naefgh",
        "output": "5"
      },
      {
        "input": "aaa\naa",
        "output": "2"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string s1, s2;\n  cin >> s1 >> s2;\n  // Calculate LCS length\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s1 = sc.nextLine();\n    String s2 = sc.nextLine();\n    // Calculate LCS length\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst s1 = input[0];\nconst s2 = input[1];\n// Calculate and print LCS length"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n  string s1, s2;\n  cin >> s1 >> s2;\n  int m = s1.length(), n = s2.length();\n  vector<vector<int>> dp(m+1, vector<int>(n+1, 0));\n  for(int i = 1; i <= m; i++) {\n    for(int j = 1; j <= n; j++) {\n      if(s1[i-1] == s2[j-1]) {\n        dp[i][j] = dp[i-1][j-1] + 1;\n      } else {\n        dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n      }\n    }\n  }\n  cout << dp[m][n];\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s1 = sc.nextLine();\n    String s2 = sc.nextLine();\n    int m = s1.length(), n = s2.length();\n    int[][] dp = new int[m+1][n+1];\n    for(int i = 1; i <= m; i++) {\n      for(int j = 1; j <= n; j++) {\n        if(s1.charAt(i-1) == s2.charAt(j-1)) {\n          dp[i][j] = dp[i-1][j-1] + 1;\n        } else {\n          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n        }\n      }\n    }\n    System.out.println(dp[m][n]);\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst s1 = input[0];\nconst s2 = input[1];\nconst m = s1.length, n = s2.length;\nconst dp = Array.from({length: m+1}, () => Array(n+1).fill(0));\nfor(let i = 1; i <= m; i++) {\n  for(let j = 1; j <= n; j++) {\n    if(s1[i-1] === s2[j-1]) {\n      dp[i][j] = dp[i-1][j-1] + 1;\n    } else {\n      dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n  }\n}\nconsole.log(dp[m][n]);"
      }
    ]
  },

  {
    "title": "0/1 Knapsack Problem",
    "description": "Given weights and values of n items, and a knapsack capacity W, find the maximum value that can be obtained by selecting items such that total weight doesn't exceed W. Each item can be selected at most once.",
    "difficulty": "hard",
    "tags": "dp",
    "visibleTestCase": [
      {
        "input": "3 50\n10 20 30\n60 100 120",
        "output": "220",
        "explaination": "Select items with weights 20 and 30, total value = 100 + 120 = 220"
      },
      {
        "input": "4 10\n5 4 6 3\n10 40 30 50",
        "output": "90",
        "explaination": "Select items with weights 4 and 3, total value = 40 + 50 = 90"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "5 15\n1 2 3 4 5\n10 20 30 40 50",
        "output": "150"
      },
      {
        "input": "2 100\n50 60\n100 200",
        "output": "200"
      },
      {
        "input": "4 7\n1 3 4 5\n1 4 5 7",
        "output": "9"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n, W;\n  cin >> n >> W;\n  int weights[n], values[n];\n  // Read weights and values, calculate max value\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int W = sc.nextInt();\n    // Read weights and values, calculate max value\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, W] = input[0].split(' ').map(Number);\nconst weights = input[1].split(' ').map(Number);\nconst values = input[2].split(' ').map(Number);\n// Calculate and print max value"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  int n, W;\n  cin >> n >> W;\n  int weights[n], values[n];\n  for(int i = 0; i < n; i++) cin >> weights[i];\n  for(int i = 0; i < n; i++) cin >> values[i];\n  vector<vector<int>> dp(n+1, vector<int>(W+1, 0));\n  for(int i = 1; i <= n; i++) {\n    for(int w = 0; w <= W; w++) {\n      if(weights[i-1] <= w) {\n        dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]]);\n      } else {\n        dp[i][w] = dp[i-1][w];\n      }\n    }\n  }\n  cout << dp[n][W];\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int W = sc.nextInt();\n    int[] weights = new int[n];\n    int[] values = new int[n];\n    for(int i = 0; i < n; i++) weights[i] = sc.nextInt();\n    for(int i = 0; i < n; i++) values[i] = sc.nextInt();\n    int[][] dp = new int[n+1][W+1];\n    for(int i = 1; i <= n; i++) {\n      for(int w = 0; w <= W; w++) {\n        if(weights[i-1] <= w) {\n          dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]]);\n        } else {\n          dp[i][w] = dp[i-1][w];\n        }\n      }\n    }\n    System.out.println(dp[n][W]);\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, W] = input[0].split(' ').map(Number);\nconst weights = input[1].split(' ').map(Number);\nconst values = input[2].split(' ').map(Number);\nconst dp = Array.from({length: n+1}, () => Array(W+1).fill(0));\nfor(let i = 1; i <= n; i++) {\n  for(let w = 0; w <= W; w++) {\n    if(weights[i-1] <= w) {\n      dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]]);\n    } else {\n      dp[i][w] = dp[i-1][w];\n    }\n  }\n}\nconsole.log(dp[n][W]);"
      }
    ]
  },

  {
    "title": "Shortest Path in Weighted Graph",
    "description": "Given a weighted directed graph with n vertices and m edges, find the shortest path from source vertex 0 to all other vertices using Dijkstra's algorithm. Print the shortest distances separated by space. Print -1 for unreachable vertices.",
    "difficulty": "hard",
    "tags": "graph",
    "visibleTestCase": [
      {
        "input": "4 5\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5",
        "output": "0 3 1 4",
        "explaination": "Shortest paths from 0: to 0=0, to 1=3 (via 2), to 2=1, to 3=4 (via 1)"
      },
      {
        "input": "3 2\n0 1 5\n1 2 3",
        "output": "0 5 8",
        "explaination": "Path 0->1 costs 5, path 0->1->2 costs 8"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "5 6\n0 1 10\n0 2 3\n1 3 2\n2 1 4\n2 3 8\n3 4 5",
        "output": "0 7 3 9 14"
      },
      {
        "input": "4 3\n0 1 1\n1 2 2\n0 3 10",
        "output": "0 1 3 10"
      },
      {
        "input": "3 1\n0 1 5",
        "output": "0 5 -1"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n  int n, m;\n  cin >> n >> m;\n  // Read edges and implement Dijkstra\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int m = sc.nextInt();\n    // Read edges and implement Dijkstra\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, m] = input[0].split(' ').map(Number);\nconst graph = Array.from({length: n}, () => []);\n// Read edges and implement Dijkstra"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\nusing namespace std;\n\nint main() {\n  int n, m;\n  cin >> n >> m;\n  vector<vector<pair<int,int>>> graph(n);\n  for(int i = 0; i < m; i++) {\n    int u, v, w;\n    cin >> u >> v >> w;\n    graph[u].push_back({v, w});\n  }\n  vector<int> dist(n, INT_MAX);\n  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n  dist[0] = 0;\n  pq.push({0, 0});\n  while(!pq.empty()) {\n    int d = pq.top().first;\n    int u = pq.top().second;\n    pq.pop();\n    if(d > dist[u]) continue;\n    for(auto [v, w] : graph[u]) {\n      if(dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        pq.push({dist[v], v});\n      }\n    }\n  }\n  for(int i = 0; i < n; i++) {\n    if(dist[i] == INT_MAX) cout << -1;\n    else cout << dist[i];\n    if(i < n-1) cout << \" \";\n  }\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.*;\n\nclass Pair implements Comparable<Pair> {\n  int node, dist;\n  Pair(int d, int n) { dist = d; node = n; }\n  public int compareTo(Pair p) { return this.dist - p.dist; }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), m = sc.nextInt();\n    ArrayList<ArrayList<Pair>> graph = new ArrayList<>();\n    for(int i = 0; i < n; i++) graph.add(new ArrayList<>());\n    for(int i = 0; i < m; i++) {\n      int u = sc.nextInt(), v = sc.nextInt(), w = sc.nextInt();\n      graph.get(u).add(new Pair(w, v));\n    }\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    PriorityQueue<Pair> pq = new PriorityQueue<>();\n    dist[0] = 0;\n    pq.add(new Pair(0, 0));\n    while(!pq.isEmpty()) {\n      Pair p = pq.poll();\n      int u = p.node;\n      if(p.dist > dist[u]) continue;\n      for(Pair neighbor : graph.get(u)) {\n        if(dist[u] + neighbor.dist < dist[neighbor.node]) {\n          dist[neighbor.node] = dist[u] + neighbor.dist;\n          pq.add(new Pair(dist[neighbor.node], neighbor.node));\n        }\n      }\n    }\n    for(int i = 0; i < n; i++) {\n      System.out.print(dist[i] == Integer.MAX_VALUE ? -1 : dist[i]);\n      if(i < n-1) System.out.print(\" \");\n    }\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, m] = input[0].split(' ').map(Number);\nconst graph = Array.from({length: n}, () => []);\nfor(let i = 1; i <= m; i++) {\n  const [u, v, w] = input[i].split(' ').map(Number);\n  graph[u].push({node: v, weight: w});\n}\nconst dist = new Array(n).fill(Infinity);\nconst pq = [[0, 0]];\ndist[0] = 0;\nwhile(pq.length > 0) {\n  pq.sort((a, b) => a[0] - b[0]);\n  const [d, u] = pq.shift();\n  if(d > dist[u]) continue;\n  for(let {node: v, weight: w} of graph[u]) {\n    if(dist[u] + w < dist[v]) {\n      dist[v] = dist[u] + w;\n      pq.push([dist[v], v]);\n    }\n  }\n}\nconst result = dist.map(d => d === Infinity ? -1 : d);\nconsole.log(result.join(' '));"
      }
    ]
  },

  {
    "title": "Merge K Sorted Linked Lists",
    "description": "You are given k sorted linked lists. Each list is provided as space-separated integers. Merge all k lists into one sorted list and return it. Input format: First line contains k (number of lists), followed by k lines each containing the size and elements of that list.",
    "difficulty": "hard",
    "tags": "linkedList",
    "visibleTestCase": [
      {
        "input": "3\n3 1 4 5\n3 1 3 4\n2 2 6",
        "output": "1 1 2 3 4 4 5 6",
        "explaination": "Merging [1,4,5], [1,3,4], and [2,6] gives [1,1,2,3,4,4,5,6]"
      },
      {
        "input": "2\n2 1 3\n2 2 4",
        "output": "1 2 3 4",
        "explaination": "Merging [1,3] and [2,4] gives [1,2,3,4]"
      }
    ],
    "hiddenTestCase": [
      {
        "input": "4\n2 1 5\n3 2 3 4\n1 6\n2 0 7",
        "output": "0 1 2 3 4 5 6 7"
      },
      {
        "input": "1\n5 1 2 3 4 5",
        "output": "1 2 3 4 5"
      },
      {
        "input": "3\n2 10 20\n2 5 15\n2 1 25",
        "output": "1 5 10 15 20 25"
      }
    ],
    "startCode": [
      {
        "language": "C++",
        "boilerCode": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  int k;\n  cin >> k;\n  vector<vector<int>> lists(k);\n  // Read k lists and merge them\n  return 0;\n}"
      },
      {
        "language": "Java",
        "boilerCode": "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int k = sc.nextInt();\n    // Read k lists and merge them\n  }\n}"
      },
      {
        "language": "JavaScript",
        "boilerCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst k = parseInt(input[0]);\nconst lists = [];\n// Read k lists and merge them"
      }
    ],
    "referenceSolution": [
      {
        "language": "C++",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n  int k;\n  cin >> k;\n  vector<vector<int>> lists(k);\n  priority_queue<pair<int, pair<int,int>>, vector<pair<int, pair<int,int>>>, greater<pair<int, pair<int,int>>>> pq;\n  for(int i = 0; i < k; i++) {\n    int n;\n    cin >> n;\n    lists[i].resize(n);\n    for(int j = 0; j < n; j++) cin >> lists[i][j];\n    if(n > 0) pq.push({lists[i][0], {i, 0}});\n  }\n  vector<int> result;\n  while(!pq.empty()) {\n    auto top = pq.top();\n    pq.pop();\n    int val = top.first;\n    int listIdx = top.second.first;\n    int elemIdx = top.second.second;\n    result.push_back(val);\n    if(elemIdx + 1 < lists[listIdx].size()) {\n      pq.push({lists[listIdx][elemIdx+1], {listIdx, elemIdx+1}});\n    }\n  }\n  for(int i = 0; i < result.size(); i++) {\n    cout << result[i];\n    if(i < result.size()-1) cout << \" \";\n  }\n  return 0;\n}"
      },
      {
        "language": "Java",
        "solutionCode": "import java.util.*;\n\nclass Tuple implements Comparable<Tuple> {\n  int val, listIdx, elemIdx;\n  Tuple(int v, int l, int e) { val = v; listIdx = l; elemIdx = e; }\n  public int compareTo(Tuple t) { return this.val - t.val; }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int k = sc.nextInt();\n    ArrayList<ArrayList<Integer>> lists = new ArrayList<>();\n    PriorityQueue<Tuple> pq = new PriorityQueue<>();\n    for(int i = 0; i < k; i++) {\n      int n = sc.nextInt();\n      ArrayList<Integer> list = new ArrayList<>();\n      for(int j = 0; j < n; j++) list.add(sc.nextInt());\n      lists.add(list);\n      if(n > 0) pq.add(new Tuple(list.get(0), i, 0));\n    }\n    ArrayList<Integer> result = new ArrayList<>();\n    while(!pq.isEmpty()) {\n      Tuple t = pq.poll();\n      result.add(t.val);\n      if(t.elemIdx + 1 < lists.get(t.listIdx).size()) {\n        pq.add(new Tuple(lists.get(t.listIdx).get(t.elemIdx+1), t.listIdx, t.elemIdx+1));\n      }\n    }\n    for(int i = 0; i < result.size(); i++) {\n      System.out.print(result.get(i));\n      if(i < result.size()-1) System.out.print(\" \");\n    }\n  }\n}"
      },
      {
        "language": "JavaScript",
        "solutionCode": "const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\nconst k = parseInt(input[0]);\nconst lists = [];\nfor(let i = 1; i <= k; i++) {\n  const line = input[i].split(' ').map(Number);\n  const n = line[0];\n  lists.push(line.slice(1));\n}\nconst result = [];\nconst indices = new Array(k).fill(0);\nwhile(true) {\n  let minVal = Infinity;\n  let minIdx = -1;\n  for(let i = 0; i < k; i++) {\n    if(indices[i] < lists[i].length && lists[i][indices[i]] < minVal) {\n      minVal = lists[i][indices[i]];\n      minIdx = i;\n    }\n  }\n  if(minIdx === -1) break;\n  result.push(minVal);\n  indices[minIdx]++;\n}\nconsole.log(result.join(' '));"
      }
    ]
  }
];


module.exports = problems;