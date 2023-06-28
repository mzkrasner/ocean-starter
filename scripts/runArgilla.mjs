import shell from "shelljs";

export const runArgilla = () => {
    shell.exec(
        `docker run -d --network argilla-net --name quickstart-0 -p 6900:6900 argilla/argilla-quickstart:latest`
      );
}



