# Serial Dictionary.
from typing import Dict, Any, Tuple, List


class Serial(dict):
    def __getitem__(self, key):
        return f"${list(self.keys()).index(key) + 1}"


# Pyformat to psql format.
def pyformat2psql(query: str, args_dict: Dict[str, Any]) -> Tuple[str, List[Any]]:
    # Remove args not present in query.
    args_list = list(args_dict.keys())
    for value in args_list:
        if f"{{{value}}}" not in query:
            args_dict.pop(value, None)
    # Generate query with serial positions.
    args = Serial(args_dict)
    query_formatted = query.format_map(args)
    args_formatted = list(args.values())
    return query_formatted, args_formatted


if __name__ == "__main__":
    query, args = pyformat2psql("select * from telegramqueue where id={id} and name={name}", {"name": '54', "id": 156})
    print(f"query={query}")
    print(f"args={args}")
