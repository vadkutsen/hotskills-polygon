// We import Chai to use its asserting functions here.
const { expect } = require("chai");

describe("Plarform contract tests", function () {
  let Platform;
  let hardhatPlatform;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Platform = await ethers.getContractFactory("PlatformFactory");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatPlatform = await Platform.deploy();
    const addProject = await hardhatPlatform.connect(addr1).addProject(
      {
        title: "Hola, mundo!",
        description: "Test description",
        projectType: 0,
        reward: "100",
      },
      {
        value: 101,
      }
    );
    await addProject.wait();
  });

  it("Should add project", async function () {
    const oldBalance = await ethers.provider.getBalance(
      hardhatPlatform.address
    );
    const fees = await hardhatPlatform.totalFees();
    const addProject = await hardhatPlatform.connect(addr1).addProject(
      {
        title: "Hola, mundo!",
        description: "Test description",
        projectType: 0,
        reward: 100,
      },
      {
        value: 101,
      }
    );
    expect(addProject);
    const projects = await hardhatPlatform.getAllProjects();
    expect(projects.length).to.equal(2);
    expect(await ethers.provider.getBalance(hardhatPlatform.address)).to.equal(
      parseInt(oldBalance) + 101
    );
    expect(await hardhatPlatform.totalFees()).to.equal(parseInt(fees) + 1);
  });

  it("Cannot add project with invalid amount", async function () {
    await expect(
      hardhatPlatform.connect(addr1).addProject(
        {
          title: "Hola, mundo!",
          description: "Test description",
          projectType: 0,
          reward: 100,
        },
        {
          value: 100,
        }
      )
    ).to.be.revertedWith("Wrong amount submitted");
  });

  it("Should get project", async function () {
    const project = await hardhatPlatform.getProject(1);
    expect(project.title).to.equal("Hola, mundo!");
    expect(project.description).to.equal("Test description");
    expect(project.status).to.equal(0);
  });

  it("Should apply for FCFS project", async function () {
    const applyForProject = await hardhatPlatform
      .connect(addr2)
      .applyForProject(1);
    expect(applyForProject);
    const project = await hardhatPlatform.getProject(1);
    expect(project.assignee).to.equal(addr2.address);
    expect(project.status).to.equal(1);
  });

  it("Should apply for AuthorSelected project", async function () {
    await hardhatPlatform.connect(addr1).addProject(
      {
        title: "Author Selected Porject",
        description: "Test description",
        projectType: 1,
        reward: 100,
      },
      {
        value: 101,
      }
    );
    const applyForProject = await hardhatPlatform
      .connect(addr2)
      .applyForProject(2);
    expect(applyForProject);
    const project = await hardhatPlatform.getProject(2);
    expect(project.candidates.length).to.equal(1);
    expect(project.status).to.equal(0);
  });

  it("Cannot assign project if address didn't apply", async function () {
    await hardhatPlatform.connect(addr1).addProject(
      {
        title: "Hola, mundo!",
        description: "Test description",
        projectType: 1,
        reward: 100,
      },
      {
        value: 101,
      }
    );
    await expect(
      hardhatPlatform.connect(addr1).assignProject(2, addr2.address)
    ).to.be.revertedWith("Invalid address.");
  });

  it("Should assign project", async function () {
    await hardhatPlatform.connect(addr1).addProject(
      {
        title: "Hola, mundo!",
        description: "Test description",
        projectType: 1,
        reward: 100,
      },
      {
        value: 101,
      }
    );
    await hardhatPlatform.connect(addr2).applyForProject(2);
    const assignProject = await hardhatPlatform
      .connect(addr1)
      .assignProject(2, addr2.address);
    expect(assignProject);
    const project = await hardhatPlatform.getProject(2);
    expect(project.assignee).to.equal(addr2.address);
    expect(project.status).to.equal(1);
  });

  it("Cannot unassign not assigned project", async function () {
    await expect(
      hardhatPlatform.connect(addr1).unassignProject(1)
    ).to.be.revertedWith("Project is not assigned.");
  });

  it("Should unassign project", async function () {
    await hardhatPlatform.connect(addr1).addProject(
      {
        title: "Hola, mundo!",
        description: "Test description",
        projectType: 1,
        reward: 100,
      },
      {
        value: 101,
      }
    );
    await hardhatPlatform.connect(addr2).applyForProject(2);
    const assignProject = await hardhatPlatform
      .connect(addr1)
      .assignProject(2, addr2.address);
    expect(assignProject);
    await hardhatPlatform.connect(addr1).unassignProject(2);
    const project = await hardhatPlatform.getProject(2);
    expect(project.assignee).to.equal(
      "0x0000000000000000000000000000000000000000"
    );
    expect(project.status).to.equal(0);
  });

  it("Should submit result", async function () {
    await hardhatPlatform
      .connect(addr2)
      .applyForProject(1);
    await hardhatPlatform.connect(addr2).submitResult(1, "result");
    const project = await hardhatPlatform.getProject(1);
    expect(project.result).to.equal("result");
    expect(project.status).to.equal(2);
  });

  it("Should complete project", async function () {
    const oldPlatformBalance = await ethers.provider.getBalance(
      hardhatPlatform.address
    );
    await hardhatPlatform
      .connect(addr2)
      .applyForProject(1);
    await hardhatPlatform.connect(addr2).submitResult(1, "result");
    await hardhatPlatform.connect(addr1).completeProject(1, 5);
    const project = await hardhatPlatform.getProject(1);
    expect(project.completedAt).to.be.above(0);
    expect(project.status).to.equal(4);
    expect(await hardhatPlatform.getRating(addr2.address)).to.equal(5);
    expect(await ethers.provider.getBalance(hardhatPlatform.address)).to.equal(
      parseInt(oldPlatformBalance) - 100
    );
  });

  it("Should request payment", async function () {
    const oldPlatformBalance = await ethers.provider.getBalance(
      hardhatPlatform.address
    );
    await hardhatPlatform
      .connect(addr2)
      .applyForProject(1);
    await hardhatPlatform.connect(addr2).submitResult(1, "result");
    await network.provider.send("evm_increaseTime", [86400 * 10]);
    await network.provider.send("evm_mine");
    await hardhatPlatform.connect(addr2).requestPayment(1);
    const project = await hardhatPlatform.getProject(1);
    expect(project.completedAt).to.be.above(0);
    expect(project.status).to.equal(4);
    expect(await ethers.provider.getBalance(hardhatPlatform.address)).to.equal(
      parseInt(oldPlatformBalance) - 100
    );
  });

  it("Cannot request payment untill 10 days passed", async function () {
    await hardhatPlatform
      .connect(addr2)
      .applyForProject(1);
    await hardhatPlatform.connect(addr2).submitResult(1, "result");
    await network.provider.send("evm_increaseTime", [86400 * 9]);
    await network.provider.send("evm_mine");
    await expect(
      hardhatPlatform.connect(addr2).requestPayment(1)
    ).to.be.revertedWith("Need to wait 10 days.");
  });

  it("Should request change", async function () {
    await hardhatPlatform.connect(addr2).applyForProject(1);
    await hardhatPlatform.connect(addr2).submitResult(1, "result");
    const requestChange = await hardhatPlatform.connect(addr1).requestChange(1, "message");
    expect(requestChange);
    const project = await hardhatPlatform.getProject(1);
    expect(project.changeRequests.length).to.equal(1);
    expect(project.status).to.equal(3);
  });

  it("Cannot request change if not in review", async function () {
    await hardhatPlatform
      .connect(addr2)
      .applyForProject(1);
    await expect(hardhatPlatform
      .connect(addr1)
      .requestChange(1, "message")).to.be.revertedWith("Invalid status");
  });

  it("Cannot request change over the limit", async function () {
    await hardhatPlatform.connect(addr2).applyForProject(1);
    await hardhatPlatform.connect(addr2).submitResult(1, "result");
    for (let i = 0; i < 3; i++) {
      await hardhatPlatform
      .connect(addr1)
      .requestChange(1, "message");
      await hardhatPlatform.connect(addr2).submitResult(1, "result");
    }
    await expect(hardhatPlatform
      .connect(addr1)
      .requestChange(1, "message")).to.be.revertedWith("Limit exceeded");
  });

  it("Should delete project", async function () {
    await hardhatPlatform.connect(addr1).addProject(
      {
        title: "Title 2",
        description: "Test description 2",
        projectType: 0,
        reward: 100,
      },
      {
        value: 101,
      }
    );
    const oldBalance = await ethers.provider.getBalance(
      hardhatPlatform.address
    );
    await hardhatPlatform.connect(addr1).deleteProject(2);
    const allProjects = await hardhatPlatform.getAllProjects();
    expect(allProjects.length).to.equal(1);
    await expect(hardhatPlatform.getProject(2)).to.be.revertedWith(
      "Project not found."
    );
    expect(await ethers.provider.getBalance(hardhatPlatform.address)).to.equal(
      parseInt(oldBalance) - 100
    );
    await hardhatPlatform.connect(addr1).addProject(
      {
        title: "Title 3",
        description: "Test description 3",
        projectType: 0,
        reward: 100,
      },
      {
        value: 101,
      }
    );
    await hardhatPlatform.connect(addr1).deleteProject(3);
    expect(allProjects.length).to.equal(1);
  });

  it("Should withdraw", async function () {
    const oldBalance = await ethers.provider.getBalance(
      hardhatPlatform.address
    );
    expect(await hardhatPlatform.totalFees()).to.equal(1);
    await hardhatPlatform.withdrawFees();
    expect(await hardhatPlatform.totalFees()).to.equal(0);
    expect(await ethers.provider.getBalance(hardhatPlatform.address)).to.equal(
      parseInt(oldBalance) - 1
    );
  });

  it("Should set the right owner", async function () {
    expect(await hardhatPlatform.owner()).to.equal(owner.address);
  });

  it("Should get platform fee", async function () {
    expect(await hardhatPlatform.platformFeePercentage()).to.equal(1);
  });

  it("Should set the right fee", async function () {
    await hardhatPlatform.setPlatformFee(2);
    expect(await hardhatPlatform.platformFeePercentage()).to.equal(2);
  });
});
