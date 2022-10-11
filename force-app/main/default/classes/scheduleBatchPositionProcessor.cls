public class scheduleBatchPositionProcessor implements schedulable{
    public void execute(Schedulablecontext sc) {
            PositionProcessor posProc = new PositionProcessor();
            Database.executeBatch(posProc);
    }
}
