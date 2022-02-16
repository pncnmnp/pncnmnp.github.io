**Preemption** is the act of temporarily interrupting an executing task, with the intention of resuming it at a later time.

**Preemption** has an important side effect for interactive processes that are given higher priority with respect to CPU bound processes, therefore users are immediately assigned computing resources at the simple pressing of a key or when moving a mouse.

In time-sharing systems, **context switches** are performed rapidly, which makes it seem like multiple processes are being executed simultaneously on the same processor.

Simultaneous execution of multiple processes is called **concurrency**.

Why is IPC essential?
* **For security and reliability**, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled **inter-process communication** functionality.

* The operating system keeps its processes separate and allocates the resources they need, so that they are less likely to interfere with each other and cause system failures (e.g., **deadlock or thrashing**). The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

What does computer system processes consists of? (usually active processes are held in data structures called **process control block**)
* An **image of the executable machine code** associated with a program
* Memory (typically some region of virtual memory); which includes the:
    * **executable code**
    * **process-specific data** (input and output)
    * a **call stack** (to keep track of active subroutines and/or other events)
        * Stack data structure that stores information about the active subroutines of a computer program
        * WHY?
            * keep track of the point to which each active subroutine should return control when it finishes executing
            * HOW?
                * the address following the instruction, the **return address**, is *pushed onto the top of the call stack* with each call.
    * a **heap** to *hold intermediate computation data generated during run time*
* Operating system descriptors of resources that are allocated to the process, such as: 
    * file descriptors (Unix terminology) 
    * handles (Windows)
    * data sources and sinks.
* Security attributes, such as the:
    * **process owner** and the 
    * **process' set of permissions** (allowable operations).
* **Context**
    * such as the content of registers and physical memory addressing
    * > **A task context** is the minimal set of data used by a task (which may be a process, thread, or fiber) that must be saved to allow a task to be interrupted, and later continued from the same point. The concept of context assumes significance in the case of interruptible tasks, wherein, upon being interrupted, the processor saves the context and proceeds to serve the interrupt service routine. Thus, the smaller the context is, the smaller the latency is.

**Process Control Block**:
* **Process identification**: 
    * include a **unique identifier for the process** (almost invariably an integer) and, 
    * in a __multiuser-multitasking system__, data such as the **identifier of the parent process**, user identifier, user group identifier, etc. 
    * The process id is particularly relevant since it is often used to cross-reference the tables defined above, e.g. showing which process is using which I/O devices, or memory areas.
* **Process state**:
    * **define the status of a process when it is suspended, allowing the OS to restart it later.** 
    * During context switch, the running process is stopped and another process runs. The kernel must stop the execution of the running process, copy out the values in hardware registers to its PCB, and update the hardware registers with the values from the PCB of the new process.
* **Process control**:
    * Process control information is used by the OS to manage the process itself. This includes:
        * Process state - new, ready, running, waiting or terminated.
        * Process structuring information – the process's children id's
        * **Interprocess communication information** – flags, signals and messages associated with the communication among independent processes
        * Process Privileges - allowed/disallowed
        * Process scheduling state - ready, suspended
        * PID
        * PC - keeps track of the next instruction
        * CPU Registers – Register set where process needs to be stored for execution for running state
        * CPU Scheduling Information – information scheduling CPU time
        * Memory Management Information – page table, memory limits, segment table
        * Accounting Information – amount of CPU used for process execution, time limits, execution ID etc.
        * I/O Status Information – list of I/O devices allocated to the process.

Call Stack Layout (**upward-growing stacks**)

![Call Stack Layout](https://upload.wikimedia.org/wikipedia/commons/d/d3/Call_stack_layout.svg)
What is pushed onto the stack?
* the arguments (**parameter values**) passed to the routine (if any);
* the **return address** back to the routine's caller (e.g. in the DrawLine stack frame, an address into DrawSquare's code); and
* space for the **local variables of the routine** (if any).

Who manages memory?
* In some operating systems, e.g. OS/360 and successors, memory is managed by the operating system
*  **Unix-like operating systems**, memory is managed at the application level.

How is manual memory management performed?
* The task of fulfilling an allocation request consists of **locating a block of unused memory of sufficient size**. Memory requests are satisfied by allocating portions **from** a large pool of memory called the **heap or free store**.
* Issues:
    * External fragmentation
    * Metadata (can invalidate size of (individually) small allocations) - managed by chunking
    * Check for memory leaks

Scheduling algorithms:
* FCFS: first come first serve (**non preemtive**)
    * Convoy effect: Where shorter bust time processes have to wait for longer amount of time in RAM
* SJF: shortest job first (**non preemtive**)
* SRTF: shortest remaining time first (**preemtive version of SJF**)
* PS: priority scheduling (**preemtive and non preemptive**)
* RR: round robin (**preemtive based on time quantum**)
* MLQS: multilevel queue scheduling
* MLFQ: multilevel feedback queue

(**Preemptive scheduling is only available on hardware with timer interrupts**)

(**Linux kernel uses Completely Fair Scheduler**)

Scheduler metrics:
* Turnaround time - total time required by a process to complete a task (Completion time - Arrival time)
* Waiting time - amount of time process waits in ready queue (Turnaround time - Burst/execution time)
* Response time - when is the process first responded by the processor
* Throughput - the amount of processes executed per unit time

Automatic memory management?
* In many programming language implementations, the runtime environment for the program automatically allocates memory in the call stack for non-static local variables of a subroutine, called automatic variables, when the subroutine is called, and automatically releases that memory when the subroutine is exited. 
* Special declarations may allow local variables to retain values between invocations of the procedure, or may allow local variables to be accessed by other subroutines. 
* **The automatic allocation of local variables makes recursion possible**, to a depth limited by available memory.

## Swapping
* If you run out of physical memory, you use virtual memory, which stores the data in memory on disk. Reading from disk is several orders of magnitude slower than reading from memory, so this slows everything way down. (**Exchanging data between real memory and virtual memory is "swapping". The space on disk is "swap space".**)

* If your app is "using swap", then you either need to use less memory or buy more RAM.

* (Swap is useful because applications that aren't being used can be stored on disk until they are used. Then they can be "paged in" and run normally again. While it is not in memory, though, the OS can use that memory for something else, like disk cache. So it's a very useful feature, but if you don't have enough physical memory to run your program, you definitely need more memory. Fortunately, memory is really really cheap these days.)

## Process Representation In Linux 
### (p 134 - galvin)
* The process control block in the Linux operating system is represented by the C structure `task_struct` (it can also be termed as a **process descriptor**), which is found in the `<linux/sched.h>`
include file in the kernel source-code directory. 
* This structure contains all the necessary information for representing a process, including the state of the process, scheduling and memory-management information, list of open files, and pointers to the process’s parent and a list of its children and siblings. (A process’s parent is the process that created it; its children are any processes
that it creates. Its siblings are children with the same parent process) 
* Some of these fields include:
```
long state; /* state of the process */
struct sched_entity se; /* scheduling information */
struct task_struct *parent; /* this process’s parent */
struct list_head children; /* this process’s children */
struct files_struct *files; /* list of open files */
struct mm_struct *mm; /* address space of this process */
```
* For example, the state of a process is represented by the field `long state` in this structure. 
* Within the Linux kernel, **all active processes are represented using a doubly linked list of task struct**. 
* The kernel maintains a pointer — `current` — to the process currently executing on the system.

**Context switch**
* Switching the CPU to another process requires performing a state save of the current process and a state restore of a different process. This task is known as a context switch.
* Context-switch time is pure overhead, because the system does no useful work while switching. A typical speed is a few milliseconds.
* The complex the machine, the higher the context switch takes:
    * **the address space of the current process must be preserved** as the space of the next task is prepared for use.

**Where does the child process get its resources from?**
* A child process may be able to obtain its resources **directly from the operating system**
* Or it may be constrained to a **subset of the resources of the parent process**
* Restricting a child process to a subset of the parent’s resources prevents any process from overloading the system by creating too many child processes

`ls`: `/bin/ls` (used to get a directory listing)

### Fork
* A new process is created by the `fork()` system call - consists of a copy of the address space of the original process
* This allows the parent process to communicate easily with its child process.
* Both processes (the parent and the child) continue execution at the instruction after the `fork()`:
    * **return code for the `fork()` is zero for the new (child) process**
    * **(nonzero) process identifier of the child is returned to the parent.**
* After a `fork()` system call - `exec()` system call to replace the process’s memory space with a new program
* **`exec()`** -  loads a binary file into memory (destroying the memory image of the program containing the `exec()` system call) and starts its execution
    * The parent,  if it has nothing else to do while the child runs, it can issue a **`wait()`** system call to move itself off the ready queue until the termination of the child.

### Process Termination
* A process terminates when it finishes executing its final statement and asks the operating system to delete it by using the `exit()` system call.
* It may return a status value - to its parent process - **via the `wait()` system call**
* Usually, such a **system call can be invoked only by the parent of the process that is to be terminated. Otherwise, users could arbitrarily kill each other’s jobs**

When can the parent terminate the child?
* The child has exceeded its usage of some of the resources that it has been allocated
* The task assigned to the child is no longer required
* The parent is exiting, and the operating system does not allow a child to continue if its parent terminates (**cascading termination**: parent terminates, all its children terminates)

```c
// data type stands for process identification and it is used to represent process ids
pid_t pid;
int status;

// wait is passed a parameter that
// allows the parent to obtain the exit status of the child
// returns the process identifier of the terminated child
pid = wait(&status); 
```
* **The `wait()` call** may be executed in sequential code, but it is **commonly executed in a handler for the SIGCHLD signal, which the parent receives whenever a child has died.**
* If the **parent** explicitly **ignores SIGCHLD by setting its handler to SIG_IGN** (rather than simply ignoring the signal by default) or **has the SA_NOCLDWAIT flag set**, all child exit status information will be discarded and no zombie processes will be left.

#### Zombie
**Unlike normal processes, the `kill` command has no effect on a zombie process**
* When a process terminates, its resources are deallocated by the operating system. 
* However, **its entry in the process table must remain there until the parent calls `wait()`**, because the process table contains the process’s exit status.
* A process that has terminated, but whose parent has not yet called `wait()`, is known as a **zombie process**. 
* All processes transition to this state when they terminate, but generally they exist as zombies only briefly. Once the parent calls `wait()`, the process identifier of the zombie process and its entry in the process table are released.

What would happen if the parent did not invoke `wait()` and instead terminated?
* It would leave its child processes as orphans.
* Linux and UNIX address this scenario **by assigning the `init` process as the new parent to orphan processes**.
* The init process periodically invokes `wait()`, thereby allowing the exit status of any orphaned process to be collected and releasing the orphan’s process identifier and process-table entry.
* The **primary concern with many zombies** is not running out of memory, but rather **running out of process table entries**, concretely process ID numbers.

#### Status of `wait()` today
* Today, `wait()` has been replaced with `waitid()` returns all bits from the exit call in a structure called **`siginfo_t`**
* `waitid()`: mandatory part of the POSIX standard since 2001
* **`siginfo_t`**:
```c
siginfo_t {
    int      si_signo;     /* Signal number */
    int      si_errno;     /* An errno value */
    int      si_code;      /* Signal code */
    int      si_trapno;    /* Trap number that caused
                                hardware-generated signal
                                (unused on most architectures) */
    pid_t    si_pid;       /* Sending process ID */
    uid_t    si_uid;       /* Real user ID of sending process */
    int      si_status;    /* Exit value or signal */
    clock_t  si_utime;     /* User time consumed */
    clock_t  si_stime;     /* System time consumed */
    union sigval si_value; /* Signal value */
    .....
}
```

### `clone()`
https://unix.stackexchange.com/questions/199686/fork-vs-clone-on-2-6-kernel-linux

`fork()` was the original UNIX system call. It can only be used to create new processes, not threads. Also, it is portable.

In Linux, `clone()` is a new, versatile system call which can be used to create a new thread of execution. Depending on the options passed, the new thread of execution can adhere to the semantics of a UNIX process, a POSIX thread, something in between, or something completely different (like a different container). You can specify all sorts of options dictating whether memory, file descriptors, various namespaces, signal handlers, and so on get shared or copied.

Since `clone()` is the superset system call, the implementation of the `fork()` system call wrapper in glibc actually calls `clone()`, but this is an implementation detail that programmers don't need to know about. The actual real `fork()` system call still exists in the Linux kernel for backward compatibility reasons even though it has become redundant, because programs that use very old versions of libc, or another libc besides glibc, might use it.

`clone()` is also used to implement the `pthread_create()` POSIX function for creating threads.

Portable programs should call `fork()` and `pthread_create()`, not `clone()`.

## Performance
* Taking regular-time samples of the call stack can be useful in profiling the performance of programs, because if a subroutine's pointer appears on the call stack sampling data many times, it is likely a code bottleneck and should be inspected for performance problems.
* Resource leaks can be prevented or fixed by resource management: programming techniques or language constructs may prevent leaks by releasing resources promptly, while a separate process may reclaim resources that have been leaked. Many resource leaks are fixed by resource reclamation by the operating system after the process terminates and makes an exit system call.

## Command Line
### Related to `ps` and `pid`
* The `init` process (**which always has a pid of 1**) serves as the root parent process for all user processes. 
* Once the system has booted, the init process can also create various user processes, such as a web or print server, an ssh server, and the like. 
* There can be two children of `init` — `kthreadd` and `sshd`. 
    * The `kthreadd` process is **responsible for creating additional processes that perform tasks on behalf of the kernel** (in this situation, khelper and pdflush). 
    * The `sshd` process is **responsible for managing clients that connect to the system by using ssh** (which is short for secure shell). 
    * The `login` process is responsible for managing clients that directly log onto the system.
* On UNIX and Linux systems, we can obtain a listing of processes by using the `ps` command. For example, the command:
    ```bash
    <!-- e is for listing all processes
         l is for long format -->
    ps -el
    ```
    Will list complete information for all processes currently active in the system.
* **Zombies** can be identified in the output from the Unix `ps` command by the **presence of a "Z" in the "STAT" column**.

## Brendan Gregg's notes
More important that something can be done than how to do it - unknown unknowns into known unknowns
### Anti-method
* Street light anti-method: Pick observability tools that are familiar and found on the internet, run them, look for obvious issues
* Drunk man anti method: – Tune	things at random until the problem goes away
### Known methodologies
* Workload characterization: precisely describing the systems's global workload in terms of its main components
* For every resource, check:
    * utilization
    * saturation
    * errors
* Ask whys?
#### Problem Statement Method (Basics - Ticket level)
1. What makes you think there is a performance problem?
2. Has this system ever performed well?
3. What has changed recently? (Software? Hardware? Load?)
4. **Can the performance degradation be expressed in terms of latency or run time?**
5. Does the problem affect other people or applications (or is it just you)?
6. What is the environment? Software, hardware, instance types? Versions? Configuration?
#### Workload Characterization Method
* **Check what is the workload applied to the system, NOT the performance**
1. Who is causing the load? PID, UID, IP addr, ...
2. Why is the load called? code path, stack trace
3. What is the load? IOPS (input output processes), tput (throughput), type, r/w
4. How is the load changing over time? 
#### USE method
* Utilization: busy time
* Saturation: queue length or queued time
* Errors: easy to interpret (objective)
#### CPU Profile
**It reveals whats turned on, you can't run without stepping on CPU. I've caught you!**
1. Take a CPU profile
2. Understand all software in profile > 1%

(For example: for database, it can narrow down - what parts of the database matter)
#### RTFM method
How to understand performance tools or metrics:
1. Man pages
2. Books
3. Web search
4. Co-workers
5. Prior talk slides/video (this one!)
6. Support services
7. Source code
8. Experimentation
9. Social 

### Tools
* Useful to study them even if we never use them - as there is so much overlap - GUIs getting metrics from same place - `/proc`, `/sys`, and kernel
* Tool types:
    * **observability** - here we **watch activity** - safe usually depending on resource overhead
    * **benchmarking** - here we **load tests** - production tests can cause issues due to contention
    * **tuning** - he we **change stuff** - DANGER: changes could hurt performance, now or later with load
    * **static** - we check configuration - usually safe
* **Having a functional diagram - gives you a visual checklist - what do I need to understand - what is in my datapath** (**FUNDAMENTAL**)
* Observability tools:
    * `uptime`: to print load averages - 
        * In LINUX: **CPUs + disk I/O** (not just CPUs)
        * Load average is a gauge of how many processes are on average, concurrently demanding CPU attention.
        * However, on modern multitasking OS's, there is more than one thing that needs CPU attention, so under a moderate amount of load from a single process, load average should float between 0.8 and 2.
        * **Load averages > # CPUs, may mean CPU saturation** (things are queued)
        * Most tools show three averages, for 1, 5, and 15 minutes
            * If the averages are 0.0, then your system is idle.
            * If the 1 minute average is higher than the 5 or 15 minute averages, then load is increasing.
            * If the 1 minute average is lower than the 5 or 15 minute averages, then load is decreasing.
            * If they are higher than your CPU count, then you might have a performance problem (it depends).
        * **A single value** of 23 - 25, by itself, **doesn't mean anything**, but **might mean something if the CPU count is known**, and **if** it's known to be a **CPU-bound workload**.

    * `top/htop`: system and per-process interval summary
        * **Can miss short lived processes** - **atop** wont (this would be helpful, when building the kernel or something) - **Reason**: they sample when they update the screen, but we can have short lived processes that start and finish between that time - so you can see the CPU is obviously doing work - but can't identify the processes who are working
        * **%CPU is summed across all CPUs**
        *  There's one final note I want to add on CPU-bound load: I've seen **systems get incredibly high load** simply because a **multithreaded program spawned a huge number of threads** on a system without many CPUs. If you spawn 20 threads on a single-CPU system, you might see a high load average, even though there are no particular processes that seem to tie up CPU time.
    * `ps`: process status listing
        * Can display more stuff than you can see in `top`, though `htop` is customizable
        * `ps -ef f` - for ASCII art forest - shows the process and child relationships
    * `vmstat`: virtual memory statistics
        * Reports memory, paging, processes, IO, CPU, and disk scheduling
        * `vmstat [options][delay [count]]`
        * If no delay is specified, the report runs as an average since the last reboot.
        * `vmstat -s ` - memory statistics
        * `vmstat -Sm 1` - `-Sm` displays memory in MB
        * **columns to focus on**:
            * `r` - **no. of runnable tasks** - NOTE: these are waiting in the ready queue
            * Memory: **free, buffer, page cache**
            * CPU: **user time** (what my applications are doing) and **system time** (what my kernels are doing - system calls, interrupts, other kernel tasks)
        * You get info on:
            * Virtual memory used, idle memory, used as buffer, used as cache, inactive memory, active memory
            * memory swapped from a disk or to a block device
            * blocks received from a disk or to a block device
            * number of interrupts per second
            * user time: time running non-kernel code
            * system time: time running system code, etc.
    * `iostat`
        * It shows **Workload** and **Resulting performance**
        * Workload: **reads/sec, writes/sec** if high - application is spending too much load
        * can be helpful in workload characterization method
        * Resulting performance: 
            * **average queue size** (avgqu-sz)
            * **average wait** (in ms) - overall time you're waiting for block device or disk I/O
            * **service time** (calculated to remove queuing)
            * **%util** (is really %busy) - used in the USE method (**Utilization**, saturation - this **can be related to the queue stuff!**, and errors)
        * Brendan Gregg's favorite tool
    * `mpstat`
        * Multi-processor statistics
        * Generally running for CPU balance - see if there are hot CPUs
    * `free`
        * `buffers`: block device I/O cache
        * `cached`: virtual page cache
    * `strace`
        * **System call tracer**
        * It currently uses the arcane `ptrace()` (process trace) debugging interface - **pausing the target process for each syscall so that the debugger can read state**. And doing this twice: when the syscall begins, and when it ends.
        * 
        ``` 
        syscall - what it does
        =====
        read - read bytes from a file descriptor (file, socket)
        write - write bytes from a file descriptor (file, socket)
        open - open a file (returns a file descriptor)
        close - close a file descriptor
        fork - create a new process (current process is forked)
        exec - execute a new program
        connect - connect to a network host
        accept - accept a network connection
        stat - read file statistics
        ioctl - set I/O properties, or other miscellaneous functions
        mmap(addr, len, prot, flags, fd, offset) - memory mapping - map a file to the process memory address space
        unmap(addr, len) - removes a mapped file
        brk(addr) - extend the heap pointer (set the size of the data segment)
        getdents - get directory entries (used in ls)
        getpid - if child wants to know its own pid
        exit - to terminate the current process
        nice(value) - change the nice value (static priority of each thread)
        lseek(fd, offset, whence) - move the file pointer
        pause() - suspend a process till the next signal arrives
        ```
        * **`sudo strace -f -t -e trace=file python3 abc.py`**
            * `-e trace=file` filters only for syscalls that access the filesystem
        * `strace -o file_name.txt ls`
    * `tcpdump`
        * Instead of trace of system calls (like in `strace`), we are doing trace of the packets
        * it is not scaling in modern environments - has overhead
    * `netstat`
        * Multitool - lots of subcommands like `netstat -s`
    * `nicstat`
        * `iostat` like output - to check network throughput and %utilization
    * `pidstat`
        * Very useful process stats
        * **By threads** `pidstat -t 1`
        * **By disk I/O** `pidstat -d 1`
    * `lsof`
        * This application on this port is connected to another application on another port
        * `lsof -iTCP -sTCP:ESTABLISHED`
    * `dstat`
        * one of the **a way to measure everything**
    * `dstat`, `iotop`, `iostat`, `strace` (https://www.brendangregg.com/blog/2014-05-11/strace-wow-much-syscall.html)
* Man pages bifurcation:
    1. Executable programs or shell commands
    2. System calls (functions provided by the kernel)
    3. Library calls (functions within program libraries)
    4. Special files (usually found in /dev)


#### more advanced
* `ss`: more socket statistics - more information than you get out of `netstat`
* `iptraf`: neat little histogram of packet sizes sent on the network interface
* `iotop`: block device I/O by process
* `slabtop`: kernel slab allocator - if there is memory leak at kernel level
* `pcstat`: **for my database files, are they in my page cache**? And giving percentages of those.

### Benchmarking tools
* Almost benchmarks are wrong, results are usually misleading
* Common mistakes: 
    * testing the wrong target (e.g. testing file system I/O instead of disk I/O)
* `lmbench` (**memory benchmarking**) (it is l not i) - helps visualize latency vs size of the memory (main memory, L1, L2, L3)
* `fio` (**file systems or disk I/O micro-benchmarks**)
* `pchar` (**`traceroute` with bandwidth per hop**)
#### Active Benchmarking
1. Run the benchmark for hours
2. While running, **analyze and confirm the performance limiter using observability tools**:
    * Disk benchmark: run iostat, …
    * CPU benchmark: run pidstat, perf, flame graphs, … 

### Profiling
* Generally meaning sampling (like at a fixed interval or like 10000 cache misses, take a sample) - often **stack samples**
* `perf`
    * Sampling full stack traces at 99 Hz for 30 seconds
        * `perf record -F 99 -ag -- sleep 30`
    * However, when we run `perf report -n --stdio`, **output is really long**
    * So to better understand them, we can use a visualization called **flamegraphs**:
        * X axis: alphabet - **merges stacks**
        * Y axis: **stack depth**
        * Helps to understand where the code was spent, **the wider it is, the more often it was involved**.
        * The **top edge is whos on CPU**
    * **NOTE:** It gets tricky when doing dynamic languages like Java or Node.js - you need to go and fix stack and symbols to make them work

### Problems
#### Application latency is much higher, can you debug it?
* USE method is a nice way of getting a starting point and ending point
* Not enough tools to get down to the buses yet (from the basic tools), but we can go to the basic USE method and quickly go back to the customer
##### Saturation
* Start with `top` - see the user-time/system-time - who is doing bunch of stuff? system or kernel?
* Do we have some `idle` time and wait i/o? This can help us understand **if we have maxed out the CPU or not** - if yes, there might not be evidence of saturation
* Confirm the above stuff with `vmstat -Sm 1`
* If a multiprocessor system, use `mpstat` - see if we are maxing out a particular CPU or not?
##### Utilization
* In vmstat check the memory - are we swapping aggressively?
* Check the `iostat` - utilization of the disks
* **NOTE:**
    * When you max out CPU, UNIX like systems can generally be graceful about it (timesharing systems), because the kernel understands priority, it can rip threads of the CPU to run other threads BUT not so true about disks (rotational disks)
* Also look for `sar` - network load

#### App is taking forever to run
* Start with `vmstat 1` - usr time and sys time
* `mpstat 1` - same in mpstat
* `pidstat 1` - same for user time and sys time
* Is sys time because it is talking to the disks? - `iostat -x 1`
* are we talking to the network devices? - `sar -n DEV 1`
* So the disks and network interface is idle
* Am I swapping? - `vmstat 1` - see `swpd`
* Can we do strace?
```bash
strace -p `pgrep bash` 2>&1 | head -100
# pgrep - fetches the command's PID

# 2>&1:
# File descriptor 1 is the standard output (stdout).
# File descriptor 2 is the standard error (stderr).

# Here is one way to remember this construct (although it is not 
# entirely accurate): at first, 2>1 may look like a good way to redirect 
# stderr to stdout. However, it will actually be interpreted as "redirect 
# stderr to a file named 1". & indicates that what follows and precedes is 
# a file descriptor and not a filename. So the construct becomes: 2>&1.
# Consider >& as redirect merger operator.
```
#### Customer says my CPU is slow
* Do some of the above commands, see what happens
* Lets say you narrow it down to - taking more CPU time (user)
* You can do profiling:
    * `perf record -F 99 -ag -- sleep 10`
    * Then run `perf report -n -stdio` - see the overhead (% values to see where the time consuming part lies)
